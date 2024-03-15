import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Faq } from 'src/entities/faq.entity';
import { CreateFaqDto } from 'src/modules/faq/dto/createfaq.dto';
import { UpdateFaqDto } from 'src/modules/faq/dto/updatefaq.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';

export class FaqRepository {
    constructor(@InjectModel(Faq.name) private readonly faqModel: Model<Faq>) {}
    async get(query: GetQueryDto) {
        let data: Faq[];

        try {
            const findQuery = this.faqModel
                .find({ isactive: true })
                .skip(Number(query.from) * Number(query.limit))
                .sort(getSortParam(query))
                .select('-isactive -isdeleted -createdAt');

            if (query.limit > 0) {
                findQuery.limit(Number(query.limit));
            }
            if (query.search) {
                findQuery.find({ $or: [{ title: { $regex: query.search, $options: 'i' } }, { url: { $regex: query.search, $options: 'i' } }] });
            }
            if (query.title) {
                findQuery.find({ title: query.title });
            }

            data = await findQuery;
            const count = await this.faqModel.find({ isactive: true }).countDocuments(findQuery.getQuery());
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

    async create(createFaqDto: CreateFaqDto, session: ClientSession) {
        let data = new this.faqModel({
            title: createFaqDto.title,
            description: createFaqDto.description,
            isactive: true,
            isdeleted: false,
        });

        try {
            data = await data.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        return data;
    }

    async update(updateFaqDto: UpdateFaqDto, session: ClientSession) {
        const updateData = {
            title: updateFaqDto.title,
            description: updateFaqDto.description,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.faqModel
                .findOneAndUpdate({ _id: updateFaqDto.id }, updateData, {
                    new: true,
                })
                // .session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Category`);
        }

        return data;
    }

    async getById(id: MongooseSchema.Types.ObjectId) {
        let data;
        try {
            data = await this.faqModel.findById(id).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The Category  with this id does not exist`);
        }
        return data;
    }
    async delete(updateFaqDto: UpdateFaqDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.faqModel
                .findOneAndUpdate({ _id: updateFaqDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Delete Category');
        }
        return data;
    }
}
