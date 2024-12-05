import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItem } from './schemas/menu-item.schema';
import { Model } from 'mongoose';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { CategoryService } from 'src/category/category.service';
import { S3Service } from 'src/upload/s3.service';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
    private categoryService: CategoryService,
    private s3Service: S3Service,
  ) {}

  async createMenuItem(
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    const category = await this.categoryService.findOne(
      createMenuItemDto.category,
    );
    if (!category) {
      throw new Error('Category not found');
    }
    const newMenuItem = new this.menuItemModel(createMenuItemDto);
    return newMenuItem.save();
  }

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }

  async findOne(id: string): Promise<MenuItem> {
    return this.menuItemModel.findById(id);
  }

  async findByCategory(category: string): Promise<MenuItem[]> {
    return this.menuItemModel.find({
      category,
    });
  }

  async update(
    id: string,
    updateMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemModel.findByIdAndUpdate(id, updateMenuItemDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<any> {
    return this.menuItemModel.deleteOne({
      _id: id,
    });
  }
}
