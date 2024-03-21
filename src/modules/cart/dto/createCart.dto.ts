import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';


export class CreateCartDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;

    @IsOptional()
    userid: MongooseSchema.Types.ObjectId;

    @IsOptional()
    serviceid: MongooseSchema.Types.ObjectId;

    @IsOptional()
    quantity: number;

    @IsOptional()
    totalPrice: number; 
    
}