import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Service } from './service.entity'; 
import { User } from './user.entity';
import { Category } from './category.entity';

@Schema()
export class Blog extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Category.name, required: true })
    categoryId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: false })
    author_name: string;

    @Prop({ required: false })
    author_description: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: false })
    image: string;

    @Prop({ required: false })
    status: string;

    @Prop({ default: Date.now })
    archivedAt: Date;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
