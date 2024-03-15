import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';


export class CreateFaqDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
    
    @IsOptional()
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    isactive: boolean;

    @IsOptional()
    isdeleted: boolean;
}