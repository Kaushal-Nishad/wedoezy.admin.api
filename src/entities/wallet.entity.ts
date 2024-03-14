import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
// import { Service } from './service.entity'; 
import { User } from './user.entity';
import { Order } from './order.entity';

@Schema()
export class Wallet extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Order.name, required: false  })
    orderId: MongooseSchema.Types.ObjectId;

    @Prop({ default: 0 })
    amount: number;

    @Prop({ required: false })
    type: string;

    @Prop({ required: false })
    paymenttype: string;

    @Prop({ required: false })
    status: string;

    @Prop({ required: false })
    transactionId: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
