import { IsOptional } from "class-validator";
import { Schema as MongooseSchema } from "mongoose";

export class CreateOurServiceDto {
    @IsOptional()
    id : MongooseSchema.Types.ObjectId;

    @IsOptional()
    title : string;

    @IsOptional()
    slug: string;

    @IsOptional()
    type : string;

    @IsOptional()
    image : string;

    @IsOptional()
    categoryid : MongooseSchema.Types.ObjectId;

    @IsOptional()
    subcategoryid : MongooseSchema.Types.ObjectId;

    @IsOptional()
    innersubcategoryid : MongooseSchema.Types.ObjectId;

    @IsOptional()
    price : Number;

    @IsOptional()
    discount : Number;

    @IsOptional()
    discountprice : Number;

    @IsOptional()
    deration : Number;

    @IsOptional()
    description : string;

    @IsOptional()
    packagedescription : string;

    @IsOptional()
    starttime : string;

    @IsOptional()
    endtime : string;

    @IsOptional()
    videolink : string;

    @IsOptional()
    isactive: boolean;

    @IsOptional()
    isdeleted: boolean;
}