import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Permission } from './permission.entity';
import { User } from './user.entity';
@Schema()
export class UserPermission extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: User.name })
    profileid: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: Permission.name })
    permissionid: MongooseSchema.Types.ObjectId;

    @Prop({ required: true})
    action:string[]; 

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

export const UserPermissionSchema = SchemaFactory.createForClass(UserPermission);
