import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {
  @ApiProperty({ description: 'Unique identifier of the category' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Description of the category' })
  @Prop()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
