import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';


@Injectable()
export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}
    async get(getQueryDto: GetQueryDto) {
        return await this.categoryRepository.get(getQueryDto);
    }
    async create(createCategoryDto: CreateCategoryDto, session: ClientSession) {
        return await this.categoryRepository.create(createCategoryDto, session);
    }
    async update(updateCategoryDto: UpdateCategoryDto, session: ClientSession) {
        return await this.categoryRepository.update(updateCategoryDto, session);
    }
    async updateFileInCategory(id: MongooseSchema.Types.ObjectId, files: string[],session: ClientSession) {
        return await this.categoryRepository.updateFileInCategory(id, files,session);
    }
    async getById(courseId: MongooseSchema.Types.ObjectId) {
        return await this.categoryRepository.getById(courseId);
    }
    async delete(updateCategoryDto: UpdateCategoryDto, session: ClientSession) {
        return await this.categoryRepository.delete(updateCategoryDto, session);
    }
}