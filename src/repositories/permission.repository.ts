import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Permission } from 'src/entities/permission.entity';
import { CreatePermissionDto } from 'src/modules/permission/dto/createPermission.dto';
import { UpdatePermissionDto } from 'src/modules/permission/dto/updatePermission.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';

export class PermissionRepository {
    constructor(@InjectModel(Permission.name) private readonly permissionModel: Model<Permission>) {}
    async get(query: GetQueryDto) {
        let data: Permission[];

        try {

            const findQuery = this.permissionModel
                .find({ isactive: true })
                .select('-createdAt -isactive -isdeleted -lastactivityby')
                .skip(Number(query.from) * Number(query.limit))
                .sort(getSortParam(query));

            if (query.limit > 0) {
                findQuery.limit(Number(query.limit));
            }
            data = await findQuery;
            const count = await this.permissionModel.find({ isactive: true }).countDocuments(findQuery.getQuery());
            return {
                ok: true,
                data: data,
                count: count,
                filtercount: data.length,
                message: `Success`,
            };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async create(createPermissionDto: CreatePermissionDto, activeuser: MongooseSchema.Types.ObjectId, session: ClientSession) {
        let data = new this.permissionModel({
            modulename:createPermissionDto.modulename,
            action:createPermissionDto.action,
            resource:createPermissionDto.resource,
            path:createPermissionDto.path,
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

    async update(updatePermissionDto: UpdatePermissionDto, session: ClientSession) {
        const updateData = {
            modulename:updatePermissionDto.modulename,
            action:updatePermissionDto.action,
            resource:updatePermissionDto.resource,
            path:updatePermissionDto.path,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.permissionModel
                .findOneAndUpdate({ _id: updatePermissionDto.id }, updateData, {
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
    async getById(id: MongooseSchema.Types.ObjectId) {
        let data;
        try {
            data = await this.permissionModel.findById(id).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The Permission  with this id does not exist`);
        }

        return data;
    }
    async delete(updatePermissionDto: UpdatePermissionDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.permissionModel
                .findOneAndUpdate({ _id: updatePermissionDto.id }, updateData, {
                    new: true,
                })
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
