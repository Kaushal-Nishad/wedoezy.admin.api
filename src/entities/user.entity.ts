import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Package } from './package.entity';

@Schema()
export class User extends Document{
    @Prop({required: true})
    name: string;

    @Prop({required : false, unique: false})
    email: string;

    @Prop({required : false})
    countrycode: string;

    @Prop({required : false})
    mobile : string;

    @Prop({required: true , enum : ['ADMIN','USER','PARTNER']})
    role: string;

    @Prop({ required: false  })
    password: string;

    @Prop({ })
    gender: string;

    @Prop({ })
    country: string;

    @Prop({ })
    state: string;

    @Prop({ })
    city: string;

    @Prop({ })
    pincode: string;

    @Prop({ })
    address: string;

    @Prop({ required: false })
    image: string;

    @Prop({ })
    status: string;

    @Prop({ })
    language: string;

    @Prop({ })
    otp: string;

    @Prop({ })
    service_description: string;

    @Prop({ })
    areas_of_expertise: string;

    @Prop({ })
    wallet: number;

    @Prop({  required: false })
    lastactivityby: MongooseSchema.Types.ObjectId;

    @Prop()
    refreshToken: string;

    @Prop()
    refreshTokenweb: string;

    @Prop()
    refreshTokenmobile: string;

    @Prop({ required: true, default:true})
    isactive: boolean;

    @Prop({ required: true, default:false})
    isdeleted: boolean;

    @Prop({ required: true, default:false})
    isblocked: boolean;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ required: false })
    updatedAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);