import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreatePackageDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
    
    @IsOptional()
    type: string;

    @IsOptional()
    grade: string;
    
    @IsOptional()
    packagename: string;

    @IsOptional()
    packageid: string;

    @IsOptional()
    categoryid: MongooseSchema.Types.ObjectId;

    @IsOptional()
    price: number;

    @IsOptional()
    maxcourse: number;
    
    @IsOptional()
    sellingprice: number;

    @IsOptional()
    annualprice: number;
    @IsOptional()
    annualsellingprice: number;
    
    @IsOptional()
    annualprodcode: string;
    
    @IsOptional()
    annualprodprice: number;

    @IsOptional()
    monthlyprodcode: string;
    
    @IsOptional()
    monthlyprodprice: number;

    @IsOptional()
    ispaid: boolean;

    @IsOptional()
    isforsale: boolean;

    @IsOptional()
    isforliveclass: boolean;
    
    @IsOptional()
    isactive: boolean;

    @IsOptional()
    isdeleted: boolean;
    // @IsOptional()
    // id: MongooseSchema.Types.ObjectId;

    // @IsOptional()
    // category: MongooseSchema.Types.ObjectId;
    // @IsOptional()
    // name: string;

    // @IsOptional()
    // description: string;

    // @IsOptional()
    // maxcourse: number;
    
    // @IsOptional()
    // displayorder: number;

    // @IsOptional()
    // ispaid: boolean;

    // @IsOptional()
    // isactive: boolean;

    // @IsOptional()
    // isdeleted: boolean;
}
