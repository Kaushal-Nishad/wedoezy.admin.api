import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.entity';
import { SubCategory } from './subcategory.entity';
import { InnerSubCategory } from './innersubcategory.entity';


@Schema()
export class Service extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Category.name, required: false })
    categoryid: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: SubCategory.name, required: false })
    subcategoryid: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: InnerSubCategory.name, required: false })
    innersubcategoryid: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: false })
    discount: number;

    @Prop({ required: false })
    dis_price: number;

    @Prop({ required: false })
    duration: string;

    @Prop({ required: false })
    discription: string;

    @Prop({ required: false })
    package_discription: string;

    @Prop({ required: false })
    start_time: Date;

    @Prop({ required: false })
    end_time: Date;

    @Prop({ required: false })
    image: string;

    @Prop({ required: false })
    video_link: string;

    @Prop({type:Boolean,default:true, required: true })
    isactive: boolean;

    @Prop({type:Boolean,default:false, required: true })
    isdeleted: boolean;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: Date.now })
    createdAt: Date;
    
}

export const ServiceSchema = SchemaFactory.createForClass(Service);