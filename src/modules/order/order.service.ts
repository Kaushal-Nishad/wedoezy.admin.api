import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { OrderRepository } from 'src/repositories/order.repository';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';


@Injectable()
export class OrderService {
    constructor(private orderRepository: OrderRepository) {}
    async get(getQueryDto: GetQueryDto) {
        return await this.orderRepository.get(getQueryDto);
    }
    async create(createOrderDto: CreateOrderDto, session: ClientSession) {
        return await this.orderRepository.create(createOrderDto, session);
    }
    async update(updateOrderDto: UpdateOrderDto, session: ClientSession) {
        return await this.orderRepository.update(updateOrderDto, session);
    }
    async updateOrderStatus(updateOrderDto: UpdateOrderDto, activeuser: MongooseSchema.Types.ObjectId, session: ClientSession) {
        return await this.orderRepository.updateOrderStatus(updateOrderDto, activeuser, session);
    }
    async assignOrder(updateOrderDto: UpdateOrderDto, session: ClientSession) {
        return await this.orderRepository.assignOrder(updateOrderDto, session);
    }
    async getById(id: MongooseSchema.Types.ObjectId) {
        return await this.orderRepository.getById(id);
    }
    async delete(updateOrderDto: UpdateOrderDto, session: ClientSession) {
        return await this.orderRepository.delete(updateOrderDto, session);
    }
}