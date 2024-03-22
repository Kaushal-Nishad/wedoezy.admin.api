import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { SubCategoryRepository } from 'src/repositories/subcategory.repository';
import { CreateSubCategoryDto } from './dto/createSubCategory.dto';
import { UpdateSubCategoryDto } from './dto/updateSubCategory.dto';


@Injectable()
export class SubCategoryService {
    constructor(private subCategoryRepository: SubCategoryRepository) {}
    async get(getQueryDto: GetQueryDto) {
        return await this.subCategoryRepository.get(getQueryDto);
    }
    async create(createSubCategoryDto: CreateSubCategoryDto, session: ClientSession) {
        return await this.subCategoryRepository.create(createSubCategoryDto, session);
    }
    async update(updateSubCategoryDto: UpdateSubCategoryDto, session: ClientSession) {
        return await this.subCategoryRepository.update(updateSubCategoryDto, session);
    }
    async updateImage(id: MongooseSchema.Types.ObjectId, file: string, session: ClientSession) {
        return await this.subCategoryRepository.updateImage(id, file, session);
    }
    async updateLogos(id: MongooseSchema.Types.ObjectId, files: string[],session: ClientSession) {
        return await this.subCategoryRepository.updateLogos(id, files,session);
    }
    async getById(catId: MongooseSchema.Types.ObjectId) {
        return await this.subCategoryRepository.getById(catId);
    }
    async delete(updateSubCategoryDto: UpdateSubCategoryDto, session: ClientSession) {
        return await this.subCategoryRepository.delete(updateSubCategoryDto, session);
    }
}