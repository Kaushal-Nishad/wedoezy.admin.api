import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Job extends Document {
    
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    position: string;

    @Prop({ required: false })
    who_r_u_description: string;

    @Prop({ required: false })
    key_description: string;


    @Prop({ required: false })
    description: string;

    @Prop({ required: false })
    status: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
