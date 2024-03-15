import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { HelpCenterRepository } from 'src/repositories/helpcenter.repository';
import { CreateHelpCenterDto } from './dto/createHelpCenter.dto';
import { UpdateHelpCenterDto } from './dto/updateHelpCenter.dto';


@Injectable()
export class HelpCenterService {
    constructor(private helpcenterRepository: HelpCenterRepository) {}
    async get(getQueryDto: GetQueryDto) {
        return await this.helpcenterRepository.get(getQueryDto);
    }
    async create(createHelpCenterDto: CreateHelpCenterDto, session: ClientSession) {
        return await this.helpcenterRepository.create(createHelpCenterDto, session);
    }
    async update(updateHelpCenterDto: UpdateHelpCenterDto, session: ClientSession) {
        return await this.helpcenterRepository.update(updateHelpCenterDto, session);
    }
    async getById(id: MongooseSchema.Types.ObjectId) {
        return await this.helpcenterRepository.getById(id);
    }
    async delete(updateHelpCenterDto: UpdateHelpCenterDto, session: ClientSession) {
        return await this.helpcenterRepository.delete(updateHelpCenterDto, session);
    }
}