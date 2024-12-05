import { Module } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItem, MenuItemSchema } from './schemas/menu-item.schema';
import { CategoryModule } from 'src/category/category.module';
import { UploadModule } from 'src/upload/upload.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
    CategoryModule,
    UploadModule,
    UsersModule,
  ],
  providers: [MenuItemService],
  controllers: [MenuItemController],
})
export class MenuItemModule {}
