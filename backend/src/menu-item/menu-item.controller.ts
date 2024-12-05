// src/menu-item/menu-item.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MenuItem } from './schemas/menu-item.schema';
import { S3Service } from 'src/upload/s3.service';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('MenuItems')
@Controller('menu-items')
export class MenuItemController {
  constructor(
    private readonly menuItemService: MenuItemService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @Roles('admin') // Gắn metadata roles với giá trị là ['admin']
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Protect the route with JWT authentication and RolesGuard
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new menu item',
    description:
      'Creates a new menu item in the system. Only accessible by users with the "admin" role.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the menu item.',
    type: MenuItem,
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input data. The provided data does not match the required format.',
  })
  @ApiBody({
    description: 'The data to create a new menu item.',
    type: CreateMenuItemDto,
  })
  async create(
    @Body() createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemService.createMenuItem(createMenuItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get menu items by category' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Category ID to filter menu items',
  })
  async findAll(@Query('category') category?: string): Promise<MenuItem[]> {
    if (category) {
      return this.menuItemService.findByCategory(category);
    }
    return this.menuItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a menu item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the menu item to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'The found menu item',
    type: MenuItem,
  })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async findOne(@Param('id') id: string): Promise<MenuItem> {
    return this.menuItemService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a menu item' })
  @ApiParam({ name: 'id', description: 'ID of the menu item to update' })
  @ApiBody({ type: CreateMenuItemDto })
  @ApiResponse({
    status: 200,
    description: 'The updated menu item',
    type: MenuItem,
  })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemService.update(id, updateMenuItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiParam({ name: 'id', description: 'ID of the menu item to delete' })
  @ApiResponse({
    status: 200,
    description: 'The menu item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  async remove(@Param('id') id: string): Promise<any> {
    return this.menuItemService.remove(id);
  }
}
