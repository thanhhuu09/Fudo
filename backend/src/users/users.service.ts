import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async getById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async getCart(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('cart.menuItem');
    if (!user) throw new NotFoundException('User not found');
    return user.cart;
  }

  async updateCart(userId: string, updateCartDto: UpdateCartDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const menuItemId = new Types.ObjectId(updateCartDto.menuItemId); // Convert string to ObjectId

    const existingCartItem = user.cart.find(
      (item) => item.menuItem.toString() === menuItemId.toString(),
    );

    if (existingCartItem) {
      if (updateCartDto.quantity > 0) {
        existingCartItem.quantity = updateCartDto.quantity;
      } else {
        user.cart = user.cart.filter(
          (item) => item.menuItem.toString() !== menuItemId.toString(),
        );
      }
    } else if (updateCartDto.quantity > 0) {
      user.cart.push({
        menuItem: menuItemId,
        quantity: updateCartDto.quantity,
      });
    }

    await user.save();
    return user.cart;
  }

  async clearCart(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.cart = [];
    await user.save();
    return user.cart;
  }
}
