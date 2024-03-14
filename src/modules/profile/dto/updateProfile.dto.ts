import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDTO {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
    @IsOptional()
    name: string;
    
    @IsOptional()
    mobile: string;

    @IsOptional()
    email: string;

    @IsOptional()
    oldpassword: string;
    
    @IsOptional()
    newpassword: string;

}