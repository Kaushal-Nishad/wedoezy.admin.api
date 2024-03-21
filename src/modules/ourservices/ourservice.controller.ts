import { BadRequestException, Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { InjectConnection} from "@nestjs/mongoose";
import { Connection, Schema as MongooseSchema  } from "mongoose";
import { OurServiceService } from './ourservice.service';
import { GetQueryDto } from "src/dto/getQueryDto";
import { CreateOurServiceDto } from "./dto/createOurService.dto";
import { Response } from "express";
import { UpdateOurServiceDto } from "./dto/updateOurService.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@UseGuards(JwtGuard)
@ApiTags('Service')
@Controller('service')
export class ServiceController {
constructor (@InjectConnection() private readonly mongoConnection : Connection, private serviceService : OurServiceService){}

@Get('/get')
async get(@Query() getQueryDto : GetQueryDto, @Res() res: any){
    const storage : any = await this.serviceService.get(getQueryDto);
    return res.status(HttpStatus.OK).send(storage);
}

@Post('/create')
async create(@Body() createServiceDto : CreateOurServiceDto, @Res() res : Response){
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try{
        const newService = await this.serviceService.create(createServiceDto, session);
        await session.commitTransaction();
        return res.status(HttpStatus.OK).send(newService);
    }catch(err){
        session.abortTransaction();
        throw new BadRequestException(err);
    }finally{
        session.endSession();

    }
}
@Put('/update/:id')
    async update(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateServiceDto: UpdateOurServiceDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateServiceDto.id = id; try {
            const newService: any = await this.serviceService.update(updateServiceDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newService);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Put('/updatefileinservice/:id')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: `./files/service`,
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async updateFileInService(@UploadedFile() file,@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const response = [];
        if (file) {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename,
                filepath: file.path,
            };

            const session = await this.mongoConnection.startSession();
            session.startTransaction();
            try {
                const newService: any = await this.serviceService.updateFileInService(id, file.filename, session);
                await session.commitTransaction();
                return res.status(HttpStatus.OK).send(newService);
            } catch (error) {
                await session.abortTransaction();
                throw new BadRequestException(error);
            } finally {
                session.endSession();
            }
        } else {
            throw new BadRequestException('File Not found');
        }
    }

    @Get('/getById/:id')
    async getById(@Param('id') id: MongooseSchema.Types.ObjectId, @Res() res: Response) {
        const storage: any = await this.serviceService.getById(id);
        return res.status(HttpStatus.OK).send(storage);
    }
    @Put('/delete/:id')
    async delete(@Param('id') id: MongooseSchema.Types.ObjectId, @Body() updateServiceDto: UpdateOurServiceDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        updateServiceDto.id = id;
        try {
            const newService: any = await this.serviceService.delete(updateServiceDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(newService);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }
}