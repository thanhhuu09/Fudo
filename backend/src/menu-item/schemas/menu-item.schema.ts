import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/category/schemas/category.schema';

@Schema()
export class MenuItem extends Document {
  @ApiProperty({ description: 'Unique identifier of the menu item' })
  @Prop()
  id: string;

  @ApiProperty({ description: 'The name of the menu item' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Description of the menu item' })
  @Prop()
  description: string;

  @ApiProperty({ description: 'Price of the menu item' })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ description: 'URL of the menu item image' })
  @Prop()
  imageURL: string;

  @ApiProperty({ description: 'Whether the menu item is in stock' })
  @Prop()
  inStock: boolean;

  @ApiProperty({ description: 'Quality of the menu item' })
  @Prop()
  quality: string;

  @ApiProperty({ description: 'Whether the menu item is visible' })
  @Prop()
  visible: boolean;

  @ApiProperty({ description: 'Category of the menu item', type: String })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category | MongooseSchema.Types.ObjectId;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
