import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.entity';


@Schema()
export class UserSetting extends Document {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    key: string;

    @Prop({ required: true })
    value: string;

    @Prop({type:Boolean,default:true, required: true })
    isactive: boolean;
}

export const UserSettingSchema = SchemaFactory.createForClass(UserSetting);