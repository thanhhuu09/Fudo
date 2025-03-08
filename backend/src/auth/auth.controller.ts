import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { Public } from './roles/public.decorator';
import { GoogleAuthGuard } from './strategies/google-auth.guard';
import { UsersService } from 'src/users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return user;
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginUserDto })
  async login(@Res() res: Response, @Body() loginUserDto: LoginUserDto) {
    const { accessToken, refreshToken, user } =
      await this.authService.validateUser(loginUserDto);

    if (loginUserDto.rememberMe) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // nếu là false thì khi reload trang thì cookie sẽ bị xóa phía frontend
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    } else {
      // don't have expire time. It will expire when the browser is closed
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
    }
    return res.status(200).send({ accessToken, user });
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Re-generate access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const user = await this.authService.validateRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.authService.generateAccessToken(user);
    const newRefreshToken = this.authService.generateRefreshToken(user);

    if (!user.refreshTokens) {
      user.refreshTokens = [];
    }
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken); // Remove old token
    user.refreshTokens.push(newRefreshToken); // Add new token

    await this.usersService.updateRefreshTokens(user.id, user.refreshTokens);
    await res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).send({ accessToken });
  }

  // Logout
  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async logout(@Res() res: Response, @Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'];
    if (refreshToken) {
      const user = await this.authService.validateRefreshToken(refreshToken);
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      await user.save();
    }
    res.clearCookie('refreshToken');
    return res.status(200).send('Logged out successfully');
  }
  // "/auth/google → Chuyển hướng sang trang đăng nhập của Google"
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() {
    // Google Auth Guar d will redirect to Google login page
  }

  // "/auth/google/callback → Google xác thực thành công → Gọi service để xử lý"
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { access_token, user, refreshToken } =
      await this.authService.googleLogin(req.user);

    // Set refresh token to cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // encodeURIComponent giúp đảm bảo user object được truyền qua URL an toàn. Log ra sẽ thấy nó được encode
    return res.redirect(
      `${process.env.FRONTEND_URL}/login-success?token=${access_token}&user=${encodeURIComponent(
        JSON.stringify(user),
      )}`,
    );
  }
}
