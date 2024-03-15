import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { FaqRepository } from 'src/repositories/faq.repository';
import { CreateFaqDto } from './dto/createFaq.dto';
import { UpdateFaqDto } from './dto/updateFaq.dto';


@Injectable()
export class FaqService {
    constructor(private faqRepository: FaqRepository) {}
    async get(getQueryDto: GetQueryDto) {
        return await this.faqRepository.get(getQueryDto);
    }
    async create(createFaqDto: CreateFaqDto, session: ClientSession) {
        return await this.faqRepository.create(createFaqDto, session);
    }
    async update(updateFaqDto: UpdateFaqDto, session: ClientSession) {
        return await this.faqRepository.update(updateFaqDto, session);
    }
    async getById(id: MongooseSchema.Types.ObjectId) {
        return await this.faqRepository.getById(id);
    }
    async delete(updateFaqDto: UpdateFaqDto, session: ClientSession) {
        return await this.faqRepository.delete(updateFaqDto, session);
    }
}