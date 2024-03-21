import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Cart } from 'src/entities/cart.entity';
import { CreateCartDto } from 'src/modules/cart/dto/createCart.dto';
import { UpdateCartDto } from 'src/modules/cart/dto/updateCart.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';

export class CartRepository {
    constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) {}
    
    async create(createCartDto: CreateCartDto, session: ClientSession) {
        let data = new this.cartModel({
            userId: createCartDto.userid,
            serviceid: createCartDto.serviceid,
            quantity: createCartDto.quantity,
            totalPrice: createCartDto.totalPrice,
        });

        try {
            data = await data.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        return data;
    }

   
    async getCartByUserId(userid: MongooseSchema.Types.ObjectId) {
        let data;
        try {
            data = await this.cartModel.find({userid: userid}).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The Cart  with this id does not exist`);
        }
        return data;
    }

    async delete(updateCartDto: UpdateCartDto, session: ClientSession) { 
        let data;
        try {
            data = await this.cartModel
                .findOneAndDelete({ _id: updateCartDto.id }, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Delete Cart');
        }
        return data;
    }
}
