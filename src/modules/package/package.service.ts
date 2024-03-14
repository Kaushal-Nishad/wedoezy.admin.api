import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { PackageRepository } from 'src/repositories/package.repository';
import { CreatePackageDto } from './dto/createPackage.dto';
import { UpdatePackageDto } from './dto/updatePackage.dto';


@Injectable()
export class PackageService {
    constructor(private packageRepository: PackageRepository) {}

    async get(getQueryDto: GetQueryDto) {
        return await this.packageRepository.get(getQueryDto);
    }
    async getpackagenotsale() {
        return await this.packageRepository.getpackagenotsale();
    }
    async create(createPackageDto: CreatePackageDto,activeuser:  MongooseSchema.Types.ObjectId,  session: ClientSession) {
        return await this.packageRepository.create(createPackageDto,activeuser, session);
    }
    async update(updatePackageDto: UpdatePackageDto, session: ClientSession) {
        return await this.packageRepository.update(updatePackageDto, session);
    }
    async getById(id: MongooseSchema.Types.ObjectId) {
        return await this.packageRepository.getById(id);
    }
    async delete(updatePackageDto: UpdatePackageDto, session: ClientSession) {
        return await this.packageRepository.delete(updatePackageDto, session);
    }
}