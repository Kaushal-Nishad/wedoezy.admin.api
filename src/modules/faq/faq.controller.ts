import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseGuards, Req } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/createFaq.dto';
import { UpdateFaqDto } from './dto/updateFaq.dto';




// @UseGuards(JwtGuard)
@ApiTags('Faq')
@Controller('Faq')
export class FaqController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private faqService: FaqService) {}

    @Get('/get')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.faqService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createFaqDto: CreateFaqDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newHelp: any = await this.faqService.create(createFaqDto, session);
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
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateFaqDto: UpdateFaqDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateFaqDto.id = id;
        try {
            const newFaq: any = await this.faqService.update(updateFaqDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newFaq);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Get('/getById/:id')
    async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const storage: any = await this.faqService.getById(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateFaqDto: UpdateFaqDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateFaqDto.id = id;
        try {
            const newFaq: any = await this.faqService.delete(updateFaqDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newFaq);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
