import {
  BadRequestException,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createdUser: CreateUserDto): Promise<User> {
    const { name, email, hash_password } = createdUser;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(hash_password, saltOrRounds);
    const newUser = new this.userModel({
      name,
      email,
      password_hash: hashedPassword,
    });
    return newUser.save();
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(
    user: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const { email, password } = user;
    const userExists = await this.validateUser(email, password);
    if (!userExists) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email, sub: userExists._id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    const userFound = await this.userModel.findById(userExists._id);
    userFound.password_hash = undefined;

    return { accessToken, refreshToken, user: userFound };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }

    if (!payload || !payload.email || !payload.sub) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { email, sub } = payload;
    const newAccessToken = this.jwtService.sign(
      { email, sub },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        ),
      },
    );

    const newRefreshToken = this.jwtService.sign(
      { email, sub },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        ),
      },
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // Google OAuth2.
  async googleLogin(@Req() req): Promise<{ access_token: string }> {
    if (!req.user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { email, firstName, lastName, photo } = req.user;

    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) {
      const newUser = new this.userModel({
        name: `${firstName} ${lastName}`,
        email,
        photo,
      });
      await newUser.save();
    }

    // Generate my own JWT token.
    const payload = { email, sub: existingUser._id };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }
}
