import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseGuards, Req } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';




// @UseGuards(JwtGuard)
@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private orderService: OrderService) {}

    @Get('/get')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.orderService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createOrderDto: CreateOrderDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newOrder: any = await this.orderService.create(createOrderDto, session);
            await session.commitTransaction();

            return res.status(HttpStatus.OK).send(newOrder);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Put('/update/:id')
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateOrderDto: UpdateOrderDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateOrderDto.id = id;
        try {
            const newOrder: any = await this.orderService.update(updateOrderDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newOrder);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Put('/updateorderstatus/:id')
    async updateOrderStatus(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateOrderDto: UpdateOrderDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateOrderDto.id = id;
        try {
            const newOrder: any = await this.orderService.updateOrderStatus(updateOrderDto, req.user._id, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newOrder);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Put('/assignorder/:id')
    async assignOrder(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateOrderDto: UpdateOrderDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateOrderDto.id = id;
        try {
            const newOrder: any = await this.orderService.assignOrder(updateOrderDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newOrder);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Get('/getById/:id')
    async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const storage: any = await this.orderService.getById(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateOrderDto: UpdateOrderDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateOrderDto.id = id;
        try {
            const newOrder: any = await this.orderService.delete(updateOrderDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newOrder);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
