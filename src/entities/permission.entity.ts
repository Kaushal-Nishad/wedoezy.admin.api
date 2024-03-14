import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
@Schema()
export class Permission extends Document {
    @Prop({ required: true})
    modulename: string;

    @Prop({ required: true})
    action:string[];  

    @Prop({ required: true})
    resource:string;  

    @Prop({ required: true})
    path:string; 

    @Prop({ required: true, default:true})
    isactive: boolean;
    
    @Prop({ required: true, default:false})
    isdeleted: boolean;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({  required: true })
    lastactivityby: MongooseSchema.Types.ObjectId;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
