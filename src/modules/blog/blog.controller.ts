import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res,Req,Put, Query, UseGuards } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';

@UseGuards(JwtGuard)
@ApiTags('Blogs')
@Controller('blog')
export class BlogController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private blogService: BlogService) {}

    @Get('/get')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.blogService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createBlogDto: CreateBlogDto, @Res() res: Response,@Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newBlog: any = await this.blogService.create(createBlogDto,req.user._id, session);
            await session.commitTransaction();
           
            return res.status(HttpStatus.OK).send(newBlog);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Put('/update/:id')
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateBlogDto: UpdateBlogDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateBlogDto.id = id;
        try {
            const newBlog: any = await this.blogService.update(updateBlogDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newBlog);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Get('/getById/:id')
    async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const storage: any = await this.blogService.getById(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateBlogDto: UpdateBlogDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateBlogDto.id = id;
        try {
            const newBlog: any = await this.blogService.delete(updateBlogDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newBlog);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}