import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('user', 'admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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

  // Cart routes
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({
    status: 200,
    description: 'Get user cart successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get(':userId/cart')
  async getCart(@Param('userId') userId: string) {
    return this.usersService.getCart(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update user cart' })
  @ApiResponse({
    status: 200,
    description: 'Update user cart successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Put(':userId/cart')
  async updateCart(
    @Param('userId') userId: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.usersService.updateCart(userId, updateCartDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Clear user cart' })
  @ApiResponse({
    status: 200,
    description: 'Clear user cart successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Delete(':userId/cart')
  async clearCart(@Param('userId') userId: string) {
    return this.usersService.clearCart(userId);
  }
}
