import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';


export class CreatePermissionDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;

    @IsOptional()
    modulename: string;

    @IsOptional()
    action:string[];  

    @IsOptional()
    resource:string;  

    @IsOptional()
    path:string;
}