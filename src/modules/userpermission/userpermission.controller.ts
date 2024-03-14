import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseGuards, Req } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateUserPermissionDto } from './dto/createUserPermission.dto';
import { UpdateUserPermissionDto } from './dto/updateUserPermission.dto';
import { UserPermissionService } from './userpermission.service';

@UseGuards(JwtGuard)
@ApiTags('UserPermission')
@Controller('userpermission')
export class UserPermissionController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private userpermissionService: UserPermissionService) {}

    @Get('/get/:id')
    async get(@Param('id') id: MongooseSchema.Types.ObjectId, @Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.userpermissionService.get(id, getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createuserPermissionDto: CreateUserPermissionDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newPermission: any = await this.userpermissionService.create(createuserPermissionDto, req.user._id, session);
            await session.commitTransaction();

            return res.status(HttpStatus.OK).send(newPermission);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Put('/update/:id')
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateUserPermissionDto: UpdateUserPermissionDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateUserPermissionDto.id = id;
        try {
            const newPermission: any = await this.userpermissionService.update(updateUserPermissionDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newPermission);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    // @Get('/getById/:id')
    // async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
    //     const storage: any = await this.userpermissionService.getById(id);
    //     return res.status(HttpStatus.OK).send(storage);
    // }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateUserPermissionDto: UpdateUserPermissionDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateUserPermissionDto.id = id;
        try {
            const newPermission: any = await this.userpermissionService.delete(updateUserPermissionDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newPermission);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
