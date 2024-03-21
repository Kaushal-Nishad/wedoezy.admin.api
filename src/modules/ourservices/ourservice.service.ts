import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { OurServiceRepository } from 'src/repositories/ourservice.repository';
import { CreateOurServiceDto } from './dto/createOurService.dto';
import { UpdateOurServiceDto } from './dto/updateOurService.dto';


@Injectable()
export class OurServiceService {
    constructor(private serviceRepository: OurServiceRepository) {}
    async get(getQueryDto: GetQueryDto) {
        return await this.serviceRepository.get(getQueryDto);
    }
    async create(createServiceDto: CreateOurServiceDto, session: ClientSession) {
        return await this.serviceRepository.create(createServiceDto, session);
    }
    async updateFileInService(id: MongooseSchema.Types.ObjectId, file:string,session: ClientSession) {
        return await this.serviceRepository.updateFileInService(id, file,session);
    }
    async update(updateServiceDto: UpdateOurServiceDto, session: ClientSession) {
        return await this.serviceRepository.update(updateServiceDto, session);
    }
    async getById(id: MongooseSchema.Types.ObjectId) {
        return await this.serviceRepository.getById(id);
    }
    async delete(updateServiceDto: UpdateOurServiceDto, session: ClientSession) {
        return await this.serviceRepository.delete(updateServiceDto, session);
    }
}