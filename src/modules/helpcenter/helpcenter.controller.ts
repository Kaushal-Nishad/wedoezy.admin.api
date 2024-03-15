import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseGuards, Req } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { HelpCenterService } from './helpcenter.service';
import { CreateHelpCenterDto } from './dto/createHelpCenter.dto';
import { UpdateHelpCenterDto } from './dto/updateHelpCenter.dto';




@UseGuards(JwtGuard)
@ApiTags('Help Center')
@Controller('helpcenter')
export class HelpCenterController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private helpcenterService: HelpCenterService) {}

    @Get('/get')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.helpcenterService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createHelpCenterDto: CreateHelpCenterDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newHelp: any = await this.helpcenterService.create(createHelpCenterDto, session);
            await session.commitTransaction();

            return res.status(HttpStatus.OK).send(newHelp);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Put('/update/:id')
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateHelpCenterDto: UpdateHelpCenterDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateHelpCenterDto.id = id;
        try {
            const newHelp: any = await this.helpcenterService.update(updateHelpCenterDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newHelp);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Get('/getById/:id')
    async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const storage: any = await this.helpcenterService.getById(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateHelpCenterDto: UpdateHelpCenterDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateHelpCenterDto.id = id;
        try {
            const newHelp: any = await this.helpcenterService.delete(updateHelpCenterDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newHelp);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
