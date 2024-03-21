import { raw } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';


export class CreateOrderDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;

    @IsOptional()
    usertype: string;

    @IsOptional()
    orderid:string;

    @IsOptional()
    userid: MongooseSchema.Types.ObjectId;

    // @IsOptional()
    // serviceid: MongooseSchema.Types.ObjectId[];

    @IsOptional(
        raw([
            {
                serviceid: { type: MongooseSchema.Types.ObjectId },
                title: { type: String },
            },
        ]),
    )
    orderdetails: Record<any, any>[]; 
    
    @IsOptional()
    paymentamount:number;

    @IsOptional()
    orderstatus: string;

    @IsOptional()
    partnerid: MongooseSchema.Types.ObjectId;

    @IsOptional()
    appointmentdate: string;

    @IsOptional()
    appointmenttime: string;

    @IsOptional()
    transactionid: string;

    @IsOptional()
    tranid: string;

    @IsOptional()
    paymentid: string;

    @IsOptional()
    paymentmethod: string;

    @IsOptional()
    paymentstatus: string;

    @IsOptional()
    mode: string;

    @IsOptional()
    reason: string;

    @IsOptional()
    note: string;

    @IsOptional()
    description: string;

    @IsOptional()
    firstname: string;

    @IsOptional()
    lastname: string;

    @IsOptional()
    email: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    city:string;

    @IsOptional()
    state: string;

    @IsOptional()
    country: string;

    @IsOptional()
    pincode: string;

    @IsOptional()
    isactive: boolean;
    
    @IsOptional()
    isdeleted: boolean;

    @IsOptional()
    createdAt: Date;
}