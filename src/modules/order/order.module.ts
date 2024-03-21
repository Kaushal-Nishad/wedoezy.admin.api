import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/entities/order.entity';
import { OrderRepository } from 'src/repositories/order.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';


@Module({
    imports: [ MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository,JwtGuard, JwtStrategy],
    exports: [OrderService, OrderRepository],
})
export class OrderModule {}