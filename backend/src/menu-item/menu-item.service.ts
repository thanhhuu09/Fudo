import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItem } from './schemas/menu-item.schema';
import { Model } from 'mongoose';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { CategoryService } from 'src/category/category.service';
import { S3Service } from 'src/upload/s3.service';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

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
      createMenuItemDto.categoryID,
    );
    if (!category) {
      throw new Error('Category not found');
    }
    const newMenuItem = new this.menuItemModel(createMenuItemDto);
    return newMenuItem.save();
  }

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemModel.find().populate('categoryID', 'name');
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
    updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    console.log('id', id);

    const updatedMenuItem = await this.menuItemModel.findByIdAndUpdate(
      id,
      updateMenuItemDto,
      { new: true },
    );
    if (!updatedMenuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return updatedMenuItem;
  }

  async remove(id: string): Promise<MenuItem> {
    const deletedMenuItem = await this.menuItemModel.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    if (deletedMenuItem.imageURL) {
      await this.s3Service.deleteFile(deletedMenuItem.imageURL);
    }

    return deletedMenuItem;
  }
}
