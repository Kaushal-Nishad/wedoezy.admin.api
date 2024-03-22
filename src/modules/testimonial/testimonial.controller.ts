import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/createTestimonial.dto';
import { UpdateTestimonialDto } from './dto/updateTestimonial.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';




// @UseGuards(JwtGuard)
@ApiTags('Testimonial')
@Controller('testimonial')
export class TestimonialController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private testimonialService: TestimonialService) {}

    @Get('/get')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.testimonialService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createTestimonialDto: CreateTestimonialDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newHelp: any = await this.testimonialService.create(createTestimonialDto, session);
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
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateTestimonialDto: UpdateTestimonialDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateTestimonialDto.id = id;
        try {
            const newTestimonial: any = await this.testimonialService.update(updateTestimonialDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newTestimonial);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Put('/updatefileintestimonial/:id')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: `./files/testimonial`,
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
    async updateFileInTestimonial(@UploadedFile() file,@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const response = [];
        if (file) {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename,
                filepath: file.path,
            };

            const session = await this.mongoConnection.startSession();
            session.startTransaction();
            try {
                const newTestimonial: any = await this.testimonialService.updateFileInTestimonial(id, file.filename, session);
                await session.commitTransaction();
                return res.status(HttpStatus.OK).send(newTestimonial);
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

    @Get('/getById/:id')
    async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const storage: any = await this.testimonialService.getById(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateTestimonialDto: UpdateTestimonialDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateTestimonialDto.id = id;
        try {
            const newTestimonial: any = await this.testimonialService.delete(updateTestimonialDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newTestimonial);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
