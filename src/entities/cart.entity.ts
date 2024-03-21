import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Service } from './service.entity'; 
import { User } from './user.entity';

@Schema()
export class Cart extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: Service.name, required: true })
    serviceid: MongooseSchema.Types.ObjectId;

    @Prop({ default: 0 })
    totalPrice: number;

    @Prop({ default: 0 })
    quantity: number;

    @Prop({ default: Date.now })
    createdAt: Date;

}

export const CartSchema = SchemaFactory.createForClass(Cart);
