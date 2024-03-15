import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';


export class CreateEnquiryDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
    
    @IsOptional()
    name: string;

    @IsOptional()
    email: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    subject: string;

    @IsOptional()
    message: string;

}