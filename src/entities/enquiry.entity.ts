import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Enquiry extends Document {
    
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: false })
    phone: string;

    @Prop({ required: false })
    subject: string;

    @Prop({ required: false })
    message: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);
