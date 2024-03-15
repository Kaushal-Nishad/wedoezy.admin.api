import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res, Put, Query, UseGuards, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';



@UseGuards(JwtGuard)
@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private categoryService: CategoryService) {}

    @Get('/get')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.categoryService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createCategoryDto: CreateCategoryDto, @Res() res: Response, @Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newCategory: any = await this.categoryService.create(createCategoryDto, session);
            await session.commitTransaction();

            return res.status(HttpStatus.OK).send(newCategory);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Put('/update/:id')
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateCategoryDto: UpdateCategoryDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateCategoryDto.id = id;
        try {
            const newCategory: any = await this.categoryService.update(updateCategoryDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newCategory);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Put('/updatefileincategory/:id')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: `./files/category`,
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
    async updateFileInCategory(@UploadedFiles() files: Array<Express.Multer.File>,@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {

        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }
        const fileResponses = [];
        const session = await this.mongoConnection.startSession();
        session.startTransaction();

            try {
                let data=[];
                for (const file of files) {
                    data.push(file.filename);
                    fileResponses.push({
                        originalname: file.originalname,
                        filename: file.filename,
                        filepath: file.path,
                    });
                }

                await this.categoryService.updateFileInCategory(id, data, session);

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
        const storage: any = await this.categoryService.getById(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateCategoryDto: UpdateCategoryDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateCategoryDto.id = id;
        try {
            const newCategory: any = await this.categoryService.delete(updateCategoryDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newCategory);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}
