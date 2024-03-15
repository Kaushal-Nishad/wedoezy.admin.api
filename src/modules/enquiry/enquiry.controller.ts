import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Res,  Query, UseGuards, Req} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { EnquiryService } from './enquiry.service';
import { CreateEnquiryDto } from './dto/createEnquiry.dto';




// @UseGuards(JwtGuard)
@ApiTags('Enquiry')
@Controller('enquiry')
export class EnquiryController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private enquiryService: EnquiryService) {}

    @Get('/get')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.enquiryService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createEnquiryDto: CreateEnquiryDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newEnquery: any = await this.enquiryService.create(createEnquiryDto, session);
            await session.commitTransaction();

            return res.status(HttpStatus.OK).send(newEnquery);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
