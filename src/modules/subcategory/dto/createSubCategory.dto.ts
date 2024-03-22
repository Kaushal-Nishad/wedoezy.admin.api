import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';


export class CreateSubCategoryDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;

    @IsOptional()
    categoryid: MongooseSchema.Types.ObjectId;
    
    @IsOptional()
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    slug: string;

    @IsOptional()
    image: string;

    @IsOptional()
    logo1: string;

    @IsOptional()
    logo2: string;

    @IsOptional()
    logo3: string;

    @IsOptional()
    logo4: string;

    @IsOptional()
    logo5: string;

    @IsOptional()
    isactive: boolean;

    @IsOptional()
    isdeleted: boolean;
}