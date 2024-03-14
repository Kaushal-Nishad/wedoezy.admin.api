import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class JobApplication extends Document {
    
    @Prop({ required: true })
    fname: string;

    @Prop({ required: true })
    lname: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: false })
    phone: string;

    @Prop({ required: false })
    job_title: string;

    @Prop({ required: false })
    resume: string;

    @Prop({ required: false })
    status: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const JobApplicationSchema = SchemaFactory.createForClass(JobApplication);
