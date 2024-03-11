import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.entity';


@Schema()
export class SubCategory extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Category.name, required: false })
    categoryid: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    subcategory_name: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: false })
    image: string;

    @Prop({ required: false })
    logo1: string;

    @Prop({ required: false })
    logo2: string;

    @Prop({ required: false })
    logo3: string;

    @Prop({ required: false })
    logo4: string;
    
    @Prop({ required: false })
    logo5: string;

    @Prop({type:Boolean,default:true, required: true })
    isactive: boolean;

    @Prop({type:Boolean,default:false, required: true })
    isdeleted: boolean;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: Date.now })
    createdAt: Date;
    
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);