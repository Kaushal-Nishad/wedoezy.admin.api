import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


@Schema()
export class Category extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: false })
    image: string;

    @Prop({ required: false })
    icon_image: string;

    @Prop({type:Boolean,default:true, required: true })
    isactive: boolean;

    @Prop({type:Boolean,default:false, required: true })
    isdeleted: boolean;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: Date.now })
    createdAt: Date;
    
}

export const CategorySchema = SchemaFactory.createForClass(Category);