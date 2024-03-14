import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Service } from './service.entity'; 
import { User } from './user.entity';
import { Order } from './order.entity';

@Schema()
export class OrderReturn extends Document {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Order.name, required: true })
    orderId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: Service.name, required: true })
    service: MongooseSchema.Types.ObjectId;

    @Prop({ required: false })
    product_name: string;

    @Prop({ default: 0 })
    price: number;

    @Prop({ required: false })
    reason: string;

    @Prop({ required: false })
    status: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const OrderReturnSchema = SchemaFactory.createForClass(OrderReturn);
