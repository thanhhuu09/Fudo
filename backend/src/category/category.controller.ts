import { Controller, Post, Get, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/roles/public.decorator';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.Admin)
  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiBearerAuth()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'All categories have been successfully retrieved.',
    type: [Category],
  })
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully retrieved.',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async findOne(id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }
}
