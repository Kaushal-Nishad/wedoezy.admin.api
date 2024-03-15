import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';


export class CreateCategoryDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
    
    @IsOptional()
    title: string;

    @IsOptional()
    image: string;

    @IsOptional()
    icon_image: string;

    @IsOptional()
    isactive: boolean;

    @IsOptional()
    isdeleted: boolean;
}