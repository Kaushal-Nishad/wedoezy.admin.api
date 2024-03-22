import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseGuards, Req, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { SubCategoryService } from './subcategory.service';
import { CreateSubCategoryDto } from './dto/createSubCategory.dto';
import { UpdateSubCategoryDto } from './dto/updateSubCategory.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';



@UseGuards(JwtGuard)
@ApiTags('SubCategory')
@Controller('subcategory')
export class SubCategoryController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private subCategoryService: SubCategoryService) { }

    @Get('/get')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.subCategoryService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createSubCategoryDto: CreateSubCategoryDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newSubCategory: any = await this.subCategoryService.create(createSubCategoryDto, session);
            await session.commitTransaction();

            return res.status(HttpStatus.OK).send(newSubCategory);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Put('/update/:id')
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateSubCategoryDto: UpdateSubCategoryDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateSubCategoryDto.id = id;
        try {
            const newSubCategory: any = await this.subCategoryService.update(updateSubCategoryDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newSubCategory);
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
                destination: `./files/subcategory`,
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
    async updateImage(@UploadedFile() file, @Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const response = [];
        if (file) {
            const session = await this.mongoConnection.startSession();
            session.startTransaction();
            try {
                const newCat: any = await this.subCategoryService.updateImage(id, file.filename, session);
                await session.commitTransaction();
                return res.status(HttpStatus.OK).send(newCat);
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

    @Put('/updatelogos/:id')
    @UseInterceptors(
        FilesInterceptor('files', 5, {
            storage: diskStorage({
                destination: `./files/subCategory`,
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
    async updateLogos(@UploadedFiles() files: Array<Express.Multer.File>, @Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {

        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }
        const fileResponses = [];
        const session = await this.mongoConnection.startSession();
        session.startTransaction();

        try {
            let data = [];
            for (const file of files) {
                data.push(file.filename);
                fileResponses.push({
                    originalname: file.originalname,
                    filename: file.filename,
                    filepath: file.path,
                });
            }

            await this.subCategoryService.updateLogos(id, data, session);

            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(fileResponses);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error.message);
        } finally {
            session.endSession();
        }
    }


    @Get('/getById/:id')
    async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const storage: any = await this.subCategoryService.getById(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateSubCategoryDto: UpdateSubCategoryDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateSubCategoryDto.id = id;
        try {
            const newSubCategory: any = await this.subCategoryService.delete(updateSubCategoryDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newSubCategory);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
