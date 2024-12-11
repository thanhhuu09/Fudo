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
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { Public } from './roles/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    const accessToken = this.authService.generateAccessToken(user);
    const newRefreshToken = this.authService.generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie('refreshToken', newRefreshToken, {
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
    console.log('refreshToken', refreshToken);

    if (refreshToken) {
      const user = await this.authService.validateRefreshToken(refreshToken);
      user.refreshToken = '';
      await user.save();
    }
    res.clearCookie('refreshToken');
    return res.status(200).send('Logged out successfully');
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Req() req) {
    return req;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
