import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { ProfileRepository } from 'src/repositories/profile.repository';
import { UpdateProfileDTO } from './dto/updateProfile.dto';

@Injectable()
export class ProfileService {
    constructor(private profileRepository: ProfileRepository) {}
    async updatePassword(updateProfileDTO: UpdateProfileDTO, session: ClientSession) {
        return await this.profileRepository.updatePassword(updateProfileDTO, session);
    }
    async updateProfile(updateProfileDTO: UpdateProfileDTO, session: ClientSession) {
        return await this.profileRepository.updateProfile(updateProfileDTO, session);
    }
    async updateProfileImage(id: MongooseSchema.Types.ObjectId,file:string, session: ClientSession) {
        return await this.profileRepository.updateProfileImage(id,file, session);
    }
}