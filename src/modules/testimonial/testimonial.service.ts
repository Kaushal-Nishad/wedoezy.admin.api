import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { TestimonialRepository } from 'src/repositories/testimonial.repository';
import { CreateTestimonialDto } from './dto/createTestimonial.dto';
import { UpdateTestimonialDto } from './dto/updateTestimonial.dto';


@Injectable()
export class TestimonialService {
    constructor(private testimonialRepository: TestimonialRepository) {}
    async get(getQueryDto: GetQueryDto) {
        return await this.testimonialRepository.get(getQueryDto);
    }
    async create(createTestimonialDto: CreateTestimonialDto, session: ClientSession) {
        return await this.testimonialRepository.create(createTestimonialDto, session);
    }
    async update(updateTestimonialDto: UpdateTestimonialDto, session: ClientSession) {
        return await this.testimonialRepository.update(updateTestimonialDto, session);
    }

    async updateFileInTestimonial(id: MongooseSchema.Types.ObjectId, file:string,session: ClientSession) {
        return await this.testimonialRepository.updateFileInTestimonial(id, file,session);
    }

    async getById(id: MongooseSchema.Types.ObjectId) {
        return await this.testimonialRepository.getById(id);
    }
    async delete(updateTestimonialDto: UpdateTestimonialDto, session: ClientSession) {
        return await this.testimonialRepository.delete(updateTestimonialDto, session);
    }
}