// src/menu-item/menu-item.controller.ts
import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { MenuItem } from './schemas/menu-item.schema';
import { S3Service } from 'src/upload/s3.service';

@ApiTags('MenuItems')
@Controller('menu-items')
export class MenuItemController {
  constructor(
    private readonly menuItemService: MenuItemService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({
    status: 201,
    description: 'The menu item has been successfully created.',
    type: MenuItem,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({ type: CreateMenuItemDto })
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
}
