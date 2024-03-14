import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseGuards, Req } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissionDto } from './dto/updatePermission.dto';

@UseGuards(JwtGuard)
@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private permissionService: PermissionService) {}

    @Get('/get')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.permissionService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createPermissionDto: CreatePermissionDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newPermission: any = await this.permissionService.create(createPermissionDto, req.user._id, session);
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
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updatePermissionDto: UpdatePermissionDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updatePermissionDto.id = id;
        try {
            const newPermission: any = await this.permissionService.update(updatePermissionDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newPermission);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Get('/getById/:id')
    async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const storage: any = await this.permissionService.getById(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updatePermissionDto: UpdatePermissionDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updatePermissionDto.id = id;
        try {
            const newPermission: any = await this.permissionService.delete(updatePermissionDto, session);
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
