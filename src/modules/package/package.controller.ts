import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Res,Put, Query, UseGuards, Req } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/createPackage.dto';
import { UpdatePackageDto } from './dto/updatePackage.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@ApiTags('Package')
@Controller('package')
export class PackageController {
    constructor(@InjectConnection() private readonly mongoConnection: Connection, private packageService: PackageService) {}

    @Get('/get')
    async get(@Query() getQueryDto: GetQueryDto, @Res() res: any) {
        const storages: any = await this.packageService.get(getQueryDto);
        return res.status(HttpStatus.OK).send(storages);
    }

    @Get('/getpackagenotsale')
    async getpackagenotsale(@Res() res: any) {
        const storages: any = await this.packageService.getpackagenotsale();
        return res.status(HttpStatus.OK).send(storages);
    }
    @Post('/create')
    async create(@Body() createPackageDto: CreatePackageDto, @Res() res: Response,@Req() req: any) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newPackage: any = await this.packageService.create(createPackageDto,req.user._id, session);
            await session.commitTransaction();
           
            return res.status(HttpStatus.OK).send(newPackage);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Put('/update/:id')
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updatePackageDto: UpdatePackageDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updatePackageDto.id = id;
        try {
            const newPackage: any = await this.packageService.update(updatePackageDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newPackage);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
    @Get('/getById/:id')
    async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const storage: any = await this.packageService.getById(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updatePackageDto: UpdatePackageDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updatePackageDto.id = id;
        try {
            const newPackage: any = await this.packageService.delete(updatePackageDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newPackage);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}