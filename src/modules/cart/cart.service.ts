import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { CartRepository } from 'src/repositories/cart.repository';
import { CreateCartDto } from './dto/createCart.dto';
import { UpdateCartDto } from './dto/updateCart.dto';


@Injectable()
export class CartService {
    constructor(private cartRepository: CartRepository) {}
    async create(createCartDto: CreateCartDto, session: ClientSession) {
        return await this.cartRepository.create(createCartDto, session);
    }
    async getCartByUserId(id: MongooseSchema.Types.ObjectId) {
        return await this.cartRepository.getCartByUserId(id);
    }
    async delete(updateCartDto: UpdateCartDto, session: ClientSession) {
        return await this.cartRepository.delete(updateCartDto, session);
    }
}