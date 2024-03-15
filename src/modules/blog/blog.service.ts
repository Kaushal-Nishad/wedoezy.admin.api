import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { BlogRepository } from 'src/repositories/blog.repository';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';


@Injectable()
export class BlogService {
    constructor(private blogRepository: BlogRepository) {}

    async get(getQueryDto: GetQueryDto) {
        return await this.blogRepository.get(getQueryDto);
    }
    async create(createBlogDto: CreateBlogDto,activeuser:  MongooseSchema.Types.ObjectId, session: ClientSession) {
        return await this.blogRepository.create(createBlogDto,activeuser, session);
    }
    async update(updateBlogDto: UpdateBlogDto, session: ClientSession) {
        return await this.blogRepository.update(updateBlogDto, session);
    }
    async getById(courseId: MongooseSchema.Types.ObjectId) {
        return await this.blogRepository.getById(courseId);
    }
    async delete(updateBlogDto: UpdateBlogDto, session: ClientSession) {
        return await this.blogRepository.delete(updateBlogDto, session);
    }
}