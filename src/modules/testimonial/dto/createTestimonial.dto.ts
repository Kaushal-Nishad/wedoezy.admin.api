import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';


export class CreateTestimonialDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;

    @IsOptional()
    title: string;

    @IsOptional()
    designation: string;

    @IsOptional()
    description: string;

    @IsOptional()
    rating: number;

    @IsOptional()
    image: string;

    @IsOptional()
    isactive: boolean;

    @IsOptional()
    isdeleted: boolean;
}