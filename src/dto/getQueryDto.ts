import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';



export class GetQueryDto{
    @IsOptional()
    id:MongooseSchema.Types.ObjectId;

    @IsOptional()
    from?: number;

    @IsOptional()
    limit?: number;

    @IsOptional()
    categorytitle: string;

    @IsOptional()
    title: string;

    @IsOptional()
    name: string;

    @IsOptional()
    search: string;

    @IsOptional()
    softingorder: string;

    @IsOptional()
    asc: boolean;

    @IsOptional()
    type: string;

    @IsOptional()
    fromdate: Date;

    @IsOptional()
    todate: Date;

    @IsOptional()
    users: string[];

    
    @IsOptional()
    code: string[];

    @IsOptional()
    downloadxl: string;

    @IsOptional()
    category: string;

    @IsOptional()
    categoryid: MongooseSchema.Types.ObjectId;
}