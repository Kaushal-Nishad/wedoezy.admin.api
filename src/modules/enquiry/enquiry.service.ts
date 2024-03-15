import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { EnquiryRepository } from 'src/repositories/enquiry.repository';
import { CreateEnquiryDto } from './dto/createEnquiry.dto';


@Injectable()
export class EnquiryService {
    constructor(private enquiryRepository: EnquiryRepository) {}
    async get(getQueryDto: GetQueryDto) {
        return await this.enquiryRepository.get(getQueryDto);
    }
    async create(CreateEnquiryDto: CreateEnquiryDto, session: ClientSession) {
        return await this.enquiryRepository.create(CreateEnquiryDto, session);
    }
    
}