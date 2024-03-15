import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';


export class CreateBlogDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
    
    @IsOptional()
    title: string;

    @IsOptional()
    slug: string;
    @IsOptional()
    shortdescription : string;
    @IsOptional()
    description : string;

    @IsOptional()
    redirecturl : string;

    @IsOptional()
    imageurl : string;

    @IsOptional()
    image : string;

    @IsOptional()
    Url : string;

    @IsOptional()
    isactive: boolean;

    @IsOptional()
    isdeleted: boolean;
}