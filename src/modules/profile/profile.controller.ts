import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseInterceptors, UploadedFiles, UseGuards, Req, UploadedFile } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { moveFile } from 'move-file';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UpdateProfileDTO } from './dto/updateProfile.dto';
import { ProfileService } from './profile.service';
//const fs = require('fs');
const path = require('path');

@UseGuards(JwtGuard)
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private profileService: ProfileService) {}

    @Put('/updatepassword')
    async updatePassword(@Body() updateProfileDTO: UpdateProfileDTO, @Req() req: any, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateProfileDTO.id = req.user._id;
        try {
            const newPassword: any = await this.profileService.updatePassword(updateProfileDTO, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newPassword);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Put('/updateprofile')
    async updateProfile(@Body() updateProfileDTO: UpdateProfileDTO, @Req() req: any, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateProfileDTO.id = req.user._id;
        try {
            const newProfile: any = await this.profileService.updateProfile(updateProfileDTO, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newProfile);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Put('/upload')
    @UseInterceptors(
        FilesInterceptor('image', 1, {
            storage: diskStorage({
                destination: `./files`,
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async uploadMultipleFiles(@UploadedFiles() files, @Req() req: any, @Res() res: Response) {
        const response = [];
        files.forEach((file) => {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename,
                filepath: file.path,
            };
            response.push(fileReponse);
        });
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newProfile: any = await this.profileService.updateProfileImage(req.user._id, response[0].filename, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newProfile);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Put('/updateimage/:id')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './files/profile',
                filename: function (req: any, file, cb) {
                    cb(null, Math.floor(1000 + Math.random() * 9000).toString() + path.extname(file.originalname));
                },
            }),
        }),
    )
    async updateimage(@UploadedFile() file, @Param('id') id: MongooseSchema.Types.ObjectId, @Req() req: any, @Res() res: Response) {
        if (file) {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename,
                filepath: file.path,
            };
            const session = await this.mongoConnection.startSession();
            session.startTransaction();
            try {
                const newProfile: any = await this.profileService.updateProfileImage(id, file.filename, session);
                await session.commitTransaction();
                return res.status(HttpStatus.OK).send(newProfile);
            } catch (error) {
                await session.abortTransaction();
                throw new BadRequestException(error);
            } finally {
                session.endSession();
            }
        } else {
            throw new BadRequestException('File Not found');
        }
    }
}
