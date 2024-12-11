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
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Create access token
  generateAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        email: user.email,
        sub: user._id,
        roles: user.role,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        ),
      },
    );
  }

  // Create refresh token
  generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { email: user.email, sub: user._id, roles: user.role },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        ),
      },
    );
  }

  // Register a new user
  async register(createdUser: CreateUserDto): Promise<User> {
    const { name, email, password } = createdUser;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const newUser = new this.userModel({
      name,
      email,
      passwordHash: hashedPassword,
    });
    // Save the user to the database.
    await newUser.save();
    // Return the user without the password.
    return { ...newUser.toJSON(), passwordHash: undefined };
  }

  async validateUser(loginAttempt: LoginUserDto): Promise<
    | {
        accessToken: string;
        refreshToken: string;
        user: UserResponseDto;
      }
    | undefined
  > {
    const user = await this.userModel.findOne({ email: loginAttempt.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginAttempt.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    if (loginAttempt.rememberMe) {
      user.refreshToken = refreshToken;
      await user.save();
    }
    const userDto = plainToInstance(UserResponseDto, user.toJSON());

    return { accessToken, refreshToken, user: userDto };
  }

  // Validate the refresh token and return a new access token.
  async validateRefreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.userModel.findOne({
        _id: payload.sub,
        refreshToken,
      });
      if (!user) {
        throw new UnauthorizedException(
          'This refresh token is not belong to this user',
        );
      }
      return user;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token' + e);
    }
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
