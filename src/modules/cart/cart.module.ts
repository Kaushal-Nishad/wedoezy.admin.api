import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/entities/cart.entity';
import { CartRepository } from 'src/repositories/cart.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';


@Module({
    imports: [ MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])],
    controllers: [CartController],
    providers: [CartService, CartRepository,JwtGuard, JwtStrategy],
    exports: [CartService, CartRepository],
})
export class CartModule {}