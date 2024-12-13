import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/roles/roles.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Get user by ID successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async getById(@Param('userId') userId: string) {
    return this.usersService.getById(userId);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Get list of all users successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':email')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({
    status: 200,
    description: 'Get user by email successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // Cart routes
  @Get(':userId/cart')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({
    status: 200,
    description: 'Get user cart successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async getCart(@Param('userId') userId: string) {
    return this.usersService.getCart(userId);
  }

  @Put(':userId/cart')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Update user cart' })
  @ApiResponse({
    status: 200,
    description: 'Update user cart successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async updateCart(
    @Param('userId') userId: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.usersService.updateCart(userId, updateCartDto);
  }

  @Delete(':userId/cart')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({ summary: 'Clear user cart' })
  @ApiResponse({
    status: 200,
    description: 'Clear user cart successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  async clearCart(@Param('userId') userId: string) {
    return this.usersService.clearCart(userId);
  }
}
