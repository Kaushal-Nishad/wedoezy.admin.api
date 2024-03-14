import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { UserRepository } from '../../repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { exportToExcel } from 'src/shared/utils';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async create(createUserDto: CreateUserDto, session: ClientSession) {
        const createdUser = await this.userRepository.create(createUserDto, session);
        return createdUser;
    }

    async getUserById(id: MongooseSchema.Types.ObjectId) {
        return await this.userRepository.getUserById(id);
    }
    async get(getQueryDto: GetQueryDto) {
        return await this.userRepository.get(getQueryDto);
    }
    async getAllUsers(getQueryDto: GetQueryDto) {
        if (getQueryDto.downloadxl != 'Y') {
            return await this.userRepository.getAllUsers(getQueryDto);
        } else {
            const users = await this.userRepository.getAllUsers(getQueryDto);
            let data = [];
            users.data.forEach((e) => {
                console.log(e);
                const xUser = {
                    Name: String,
                    Email: String,
                    Mobile: String,
                    Role: String,
                    ClientCode: String,
                };
                xUser.Name = e.name as any;
                xUser.Email = e.email?e.email:'' as any;
                xUser.Mobile = e.mobile?e.mobile:'' as any;
                xUser.Role = e.role?e.role: '' as any;
                data.push(xUser);
            });
            if (!data) {
                throw new NotFoundException('No data to download');
            }
            return await exportToExcel(data);
        }
    }
    async delete(updateUserDto: UpdateUserDto, session: ClientSession) {
        return await this.userRepository.delete(updateUserDto, session);
    }
    async getPartners(getQueryDto: GetQueryDto) {
        return await this.userRepository.getPartners(getQueryDto);
    }
    async update(updateUserDto: UpdateUserDto, session: ClientSession) {
        return await this.userRepository.update(updateUserDto, session);
    }

    async resetpassword(updatePasswordDto: UpdatePasswordDto) {
        return await this.userRepository.resetpassword(updatePasswordDto);
    }
    
}
