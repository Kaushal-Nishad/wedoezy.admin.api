import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


@Schema()
export class Package extends Document {
    @Prop({ required: true })
    type: string;
    
    @Prop({ required: true })
    packagename: string;

    @Prop({ required: false })
    packageid: string;

    @Prop({ required: false })
    price: number;

    @Prop({ required: false })
    sellingprice: number;
    
    
    @Prop({type:Boolean,default:true, required: true })
    ispaid: boolean;

    @Prop({type:Boolean,default:true, required: true })
    isactive: boolean;

    @Prop({type:Boolean,default:false, required: true })
    isdeleted: boolean;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: Date.now })
    createdAt: Date;
    
}

export const PackageSchema = SchemaFactory.createForClass(Package);