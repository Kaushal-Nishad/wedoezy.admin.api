import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Testimonial extends Document {
    
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, default:0 })
    rating: number;

    @Prop({ required: false })
    image: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
