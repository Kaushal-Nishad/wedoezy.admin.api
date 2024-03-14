import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { UserPermissionRepository } from 'src/repositories/userpermission.repository';
import { CreateUserPermissionDto } from './dto/createUserPermission.dto';
import { UpdateUserPermissionDto } from './dto/updateUserPermission.dto';

@Injectable()
export class UserPermissionService {
    constructor(private userpermissionRepository: UserPermissionRepository) {}

    async get(userid: MongooseSchema.Types.ObjectId, getQueryDto: GetQueryDto) {
        return await this.userpermissionRepository.get(userid,getQueryDto);
    }
    async create(createuserPermissionDto: CreateUserPermissionDto, activeuser: MongooseSchema.Types.ObjectId, session: ClientSession) {
        return await this.userpermissionRepository.create(createuserPermissionDto, activeuser, session);
    }
    async update(updateUserPermissionDto: UpdateUserPermissionDto, session: ClientSession) {
        return await this.userpermissionRepository.update(updateUserPermissionDto, session);
    }
    // async getById(courseId: MongooseSchema.Types.ObjectId) {
    //     return await this.userpermissionRepository.getById(courseId);
    // }
    async delete(updateUserPermissionDto: UpdateUserPermissionDto, session: ClientSession) {
        return await this.userpermissionRepository.delete(updateUserPermissionDto, session);
    }
}
