import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserPermissionDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;

    @IsOptional()
    profileid: MongooseSchema.Types.ObjectId;

    @IsOptional()
    permissionid: MongooseSchema.Types.ObjectId;

    @IsOptional()
    action:string[]; 

    @IsOptional()
    isactive: boolean;

    @IsOptional()
    isdeleted: boolean;
}