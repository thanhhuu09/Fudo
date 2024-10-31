import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Get user by ID successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Get list of all users successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({
    status: 200,
    description: 'Get user by email successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
