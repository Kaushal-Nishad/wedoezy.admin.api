import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.entity';
import { SubCategory } from './subcategory.entity';


@Schema()
export class InnerSubCategory extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Category.name, required: false })
    categoryid: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: SubCategory.name, required: false })
    subcategoryid: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: false })
    image: string;

    @Prop({type:Boolean,default:true, required: true })
    isactive: boolean;

    @Prop({type:Boolean,default:false, required: true })
    isdeleted: boolean;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: Date.now })
    createdAt: Date;
    
}

export const InnerSubCategorySchema = SchemaFactory.createForClass(InnerSubCategory);