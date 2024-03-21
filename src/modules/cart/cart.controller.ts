import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseGuards, Req } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/createCart.dto';
import { UpdateCartDto } from './dto/updateCart.dto';




// @UseGuards(JwtGuard)
@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private cartService: CartService) {}

    @Post('/create')
    async create(@Body() createCartDto: CreateCartDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newHelp: any = await this.cartService.create(createCartDto, session);
            await session.commitTransaction();

            return res.status(HttpStatus.OK).send(newHelp);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Get('/getCartByUserId/:id')
    async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const storage: any = await this.cartService.getCartByUserId(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateCartDto: UpdateCartDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateCartDto.id = id;
        try {
            const newCart: any = await this.cartService.delete(updateCartDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newCart);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
