import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Enquiry } from 'src/entities/enquiry.entity';
import { CreateEnquiryDto } from 'src/modules/enquiry/dto/createEnquiry.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';

export class EnquiryRepository {
    constructor(@InjectModel(Enquiry.name) private readonly enquiryModel: Model<Enquiry>) {}
    async get(query: GetQueryDto) {
        let data: Enquiry[];

        try {
            const findQuery = this.enquiryModel
                .find()
                .skip(Number(query.from) * Number(query.limit))
                .sort(getSortParam(query))

            if (query.limit > 0) {
                findQuery.limit(Number(query.limit));
            }
            if (query.search) {
                findQuery.find({ $or: [{ name: { $regex: query.search, $options: 'i' } }, { url: { $regex: query.search, $options: 'i' } }] });
            }

            data = await findQuery;
            const count = await this.enquiryModel.find().countDocuments(findQuery.getQuery());
            return {
                ok: true,
                data: data,
                count: count,
                filtercount: data.length,
                message: `Success`,
            };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async create(createEnquiryDto: CreateEnquiryDto, session: ClientSession) {
        let data = new this.enquiryModel({
            name: createEnquiryDto.name,
            email: createEnquiryDto.email,
            phone: createEnquiryDto.phone,
            subject: createEnquiryDto.subject,
            message: createEnquiryDto.message,
        });

        try {
            data = await data.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        return data;
    }

}
