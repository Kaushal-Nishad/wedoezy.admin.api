import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


@Schema()
export class Blog extends Document {
    @Prop({ required: true })
    title: string;

    
    @Prop({ required: false })
    redirecturl: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    shortdescription : string;

    @Prop({ required: true })
    description : string;

    @Prop({ required: false })
    imageurl : string;

    @Prop({ required: false })
    image : string;

    @Prop({ required: false })
    Url : string;
  
    @Prop({ required:true})
    date: Date;

    @Prop({type:Boolean,default:true, required: true })
    isactive: boolean;

    @Prop({type:Boolean,default:false, required: true })
    isdeleted: boolean;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: Date.now })
    createdAt: Date;
    
    @Prop({  required: true })
    lastactivityby: MongooseSchema.Types.ObjectId;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);