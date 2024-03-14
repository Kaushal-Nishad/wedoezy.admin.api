import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissionDto } from './dto/updatePermission.dto';


@Injectable()
export class PermissionService {
    constructor(private permissionRepository: PermissionRepository) {}

    async get(getQueryDto: GetQueryDto) {
        return await this.permissionRepository.get(getQueryDto);
    }
    async create(createPermissionDto: CreatePermissionDto,activeuser:  MongooseSchema.Types.ObjectId, session: ClientSession) {
        return await this.permissionRepository.create(createPermissionDto,activeuser, session);
    }
    async update(updatePermissionDto: UpdatePermissionDto, session: ClientSession) {
        return await this.permissionRepository.update(updatePermissionDto, session);
    }
    async getById(courseId: MongooseSchema.Types.ObjectId) {
        return await this.permissionRepository.getById(courseId);
    }
    async delete(updatePermissionDto: UpdatePermissionDto, session: ClientSession) {
        return await this.permissionRepository.delete(updatePermissionDto, session);
    }
}