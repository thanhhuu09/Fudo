import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateCartDto } from './dto/update-cart.dto';
import { updateUserInfoDTO } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from './dto/user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    return plainToInstance(UserResponseDto, user.toJSON());
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find();
    const usersDTO = users.map((user) =>
      plainToInstance(UserResponseDto, user.toJSON()),
    );
    return usersDTO;
  }

  async getById(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return plainToInstance(UserResponseDto, user.toJSON());
  }

  async getCart(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('cart.menuItem');
    if (!user) throw new NotFoundException('User not found');
    return user.cart;
  }

  async updateCart(userId: string, updateCartDto: UpdateCartDto) {
    const user = await this.userModel.findById(userId).select('cart');
    if (!user) throw new NotFoundException('User not found');
    const menuItemObjectId = new Types.ObjectId(updateCartDto.menuItemId); // Convert string to ObjectId
    const existingCartItem = user.cart.find(
      (item) => item.menuItem.toString() === menuItemObjectId.toString(),
    );
    if (existingCartItem) {
      if (updateCartDto.quantity > 0) {
        // Update quantity if quantity is greater than 0
        existingCartItem.quantity = updateCartDto.quantity;
      } else {
        // Remove item from cart if quantity is 0
        user.cart = user.cart.filter(
          (item) => item.menuItem.toString() !== menuItemObjectId.toString(),
        );
      }
    } else if (updateCartDto.quantity > 0) {
      // Add item to cart if quantity is greater than 0 and item is not in cart
      user.cart.push({
        menuItem: menuItemObjectId,
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

  async updateUserInfo(userId: string, user: Partial<updateUserInfoDTO>) {
    console.log({ userId, user });

    if (user.addresses) {
      const existingUser = await this.userModel.findById(userId);
      if (!existingUser) throw new NotFoundException('User not found');

      if (user.addresses) {
        existingUser.addresses = user.addresses;
      }

      Object.assign(existingUser, user); // Update other fields. For example: name, email, phoneNumber, etc.
      await existingUser.save();

      return plainToInstance(UserDTO, existingUser.toJSON());
    }
  }

  async updateRefreshTokens(userId: string, newTokens: string[]) {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: { refreshTokens: newTokens } }, // Nếu không có $set, MongoDB có thể ghi đè toàn bộ document, gây mất dữ liệu khác.
        { new: true },
      )
      .exec();
  }
}
