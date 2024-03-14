import { ConflictException, HttpException, HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { User } from 'src/entities/user.entity';
import { UpdateProfileDTO } from 'src/modules/profile/dto/updateProfile.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { getCurrentDatetime } from 'src/shared/utils';

export class ProfileRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>, private userRepository: UserRepository) {}

    async updatePassword(updateProfileDTO: UpdateProfileDTO, session: ClientSession) {
      
        // const updateData = {
        //     password: updateProfileDTO.newpassword,
        //     isactive: true,
        //     isdeleted: false,
        //     updatedAt: actualDate,
        // };

        // let profile;
        // try {
        //     profile = await this.userModel
        //         .findOneAndUpdate({ _id: updateProfileDTO.id }, updateData, {
        //             new: true,
        //         })
        //         //.session(session)
        //         .exec();
        // } catch (error) {
        //     throw new InternalServerErrorException(error);
        // }

        // if (!profile) {
        //     throw new ConflictException(`Error trying to update Password`);
        // }

        // return profile;
        const user = await this.userRepository.getUserById(updateProfileDTO.id);

        let isValidPassword = await bcrypt.compare(updateProfileDTO.oldpassword, user.password);
        
        if (isValidPassword) {
            const updateData = {
                password: await this.userRepository.hashPassword(updateProfileDTO.newpassword),
                isactive: true,
                isdeleted: false,
                updatedAt:  getCurrentDatetime(),
            };

            let data;
            try {
                data = await this.userModel
                    .findOneAndUpdate({ _id: updateProfileDTO.id }, updateData, {
                        new: true,
                    })
                    //.session(session)
                    .exec();
            } catch (error) {
                throw new InternalServerErrorException(error);
            }

            if (!data) {
                throw new ConflictException(`Error trying to update Password`);
            }

            return data;
        } 
        else {
            throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' }, HttpStatus.FORBIDDEN);
        }
    }
    async updateProfile(updateProfileDTO: UpdateProfileDTO, session: ClientSession) {
      
        const updateData = {
            name:updateProfileDTO.name,
            email:updateProfileDTO.email,
            mobile:updateProfileDTO.mobile,
           // password: updateProfileDTO.newpassword,
            isactive: true,
            isdeleted: false,
            updatedAt:  getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.userModel
                .findOneAndUpdate({ _id: updateProfileDTO.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Profile`);
        }

        return data;
    }

    async updateProfileImage( id: MongooseSchema.Types.ObjectId,file:string, session: ClientSession) {
       
        const updateData = {
           image:file,
            isactive: true,
            isdeleted: false,
            updatedAt:  getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.userModel
                .findOneAndUpdate({ _id: id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Profile`);
        }

        return data;
    }
}
