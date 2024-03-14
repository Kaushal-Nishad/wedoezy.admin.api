import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Permission } from 'src/entities/permission.entity';
import { UserPermission } from 'src/entities/userpermission.entity';
import { UpdatePermissionDto } from 'src/modules/permission/dto/updatePermission.dto';
import { CreateUserPermissionDto } from 'src/modules/userpermission/dto/createUserPermission.dto';
import { UpdateUserPermissionDto } from 'src/modules/userpermission/dto/updateUserPermission.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';
var mongoose = require('mongoose');
export class UserPermissionRepository {
    constructor(
        @InjectModel(UserPermission.name) private readonly userpermissionModel: Model<UserPermission>,
        @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
    ) {}
    async get(userid: MongooseSchema.Types.ObjectId, query: GetQueryDto) {
        let data: UserPermission[];

        try {
            const findQuerynew = await this.permissionModel.aggregate(
                [
                    {
                        $project: {
                            _id: 0,
                            permissions: '$$ROOT',
                        },
                    },
                    {
                        $lookup: {
                            localField: 'permissions._id',
                            from: 'userpermissions',
                            foreignField: 'permissionid',
                            as: 'userpermissions',
                        },
                    },
                    {
                        $unwind: {
                            path: '$userpermissions',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $match: {
                            'permissions.isactive': true,
                            'userpermissions.profileid': new mongoose.Types.ObjectId(userid),
                        },
                    },
                    {
                        $project: {
                            _id: '$permissions._id',
                            modulename: '$permissions.modulename',
                            path: '$permissions.path',
                            resource: '$permissions.resource',
                            permissionaction: '$permissions.action',
                            userpermissionsaction: '$userpermissions.action',
                            userpermissionid: '$userpermissions._id',
                        },
                    },
                ],
                {
                    allowDiskUse: true,
                },
            );
            return {
                ok: true,
                data: await findQuerynew,
                message: `Success`,
            };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async create(createuserPermissionDto: CreateUserPermissionDto, activeuser: MongooseSchema.Types.ObjectId, session: ClientSession) {
        let data = new this.userpermissionModel({
            profileid: createuserPermissionDto.profileid,
            permissionid: createuserPermissionDto.permissionid,
            action: createuserPermissionDto.action,
            lastactivityby: activeuser,
            isactive: true,
            isdeleted: false,
        });

        try {
            // contactUs = await contactUs.save({ session });
            data = await data.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        return data;
    }

    async update(updateUserPermissionDto: UpdateUserPermissionDto, session: ClientSession) {
        const updateData = {
            profileid: updateUserPermissionDto.profileid,
            permissionid: updateUserPermissionDto.permissionid,
            action: updateUserPermissionDto.action,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.userpermissionModel
                .findOneAndUpdate({ _id: updateUserPermissionDto.id }, updateData, {
                    new: true,
                })
                // .session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Permission`);
        }

        return data;
    }
    // async getById(id: MongooseSchema.Types.ObjectId) {
    //     let data;
    //     try {
    //         data = await this.userpermissionModel.findById(id).exec();
    //     } catch (error) {
    //         throw new InternalServerErrorException(error);
    //     }

    //     if (!data) {
    //         throw new NotFoundException(`The Permission  with this id does not exist`);
    //     }

    //     return data;
    // }
    async delete(updatePermissionDto: UpdatePermissionDto, session: ClientSession) {
        let data;
        try {
            data = await this.userpermissionModel
                .deleteOne({ _id: updatePermissionDto.id })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Delete Permission');
        }
        return data;
    }
}
