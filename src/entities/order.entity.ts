import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.entity';
import { Service } from './service.entity';


@Schema()
export class Order extends Document {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
    userid: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
    partnerid: MongooseSchema.Types.ObjectId;

    // @Prop({type: MongooseSchema.Types.ObjectId, ref: Service.name, required: false })
    // serviceid: MongooseSchema.Types.ObjectId;

    @Prop(
        raw([
            {
                serviceid: { type: MongooseSchema.Types.ObjectId, ref: Service.name, required: false },
                title: { type: String },
            },
        ]),
    )
    orderdetails: Record<any, any>[]; 

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    orderid: string;

    @Prop({ required: false })
    appointment_time: string;

    @Prop({ required: false })
    appointment_date: string;

    @Prop({ required: false })
    transaction_id: string;

    @Prop({ required: false })
    payment_method: string;

    @Prop({ required: false })
    mode: string;

    @Prop({ required: false,precision:10,scale:2})
    ammount: number;

    @Prop({ required: false,precision:10,scale:2})
    subtotal: number;

    @Prop({ required: false,precision:10,scale:2})
    total: number;

    @Prop({ required: false,precision:10,scale:2})
    shipping_charge: number;

    @Prop({ required: false})
    firstname: string;

    @Prop({ required: false})
    lastname: string;

    @Prop({ required: false})
    email: string;

    @Prop({ required: false})
    phone: string;

    @Prop({ required: false})
    address: string;

    @Prop({ required: false})
    state: string;

    @Prop({ required: false})
    country: string;

    @Prop({ required: false})
    pincode: string;


    @Prop({ required: false })
    note: string;

    @Prop({ required: false })
    reason: string;

    @Prop({ required: false })
    city: string;

    @Prop({ required: false })
    usertype: string;

    @Prop({ required: true, enum: ['Pending', 'Processing', 'Completed','Cancelled'], default: 'Pending' })
    orderstatus: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: false })
    status_updated_by: MongooseSchema.Types.ObjectId;

    @Prop({ required: false })
    paymentid: string;

    @Prop({ required: false })
    tranid: string;

    @Prop({ required: true})
    payment_status: string;

    @Prop({ required: true, default: false })
    isAssigned: boolean;


    @Prop({type:Boolean,default:true, required: true })
    isactive: boolean;

    @Prop({type:Boolean,default:false, required: true })
    isdeleted: boolean;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: Date.now })
    createdAt: Date;
    
}

export const OrderSchema = SchemaFactory.createForClass(Order);