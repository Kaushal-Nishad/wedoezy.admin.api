import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { HelpCenter } from 'src/entities/helpcenter.entity';
import { CreateHelpCenterDto } from 'src/modules/helpcenter/dto/createHelpCenter.dto';
import { UpdateHelpCenterDto } from 'src/modules/helpcenter/dto/updateHelpCenter.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';

export class HelpCenterRepository {
    constructor(@InjectModel(HelpCenter.name) private readonly helpCenterModel: Model<HelpCenter>) {}
    async get(query: GetQueryDto) {
        let data: HelpCenter[];

        try {
            const findQuery = this.helpCenterModel
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
            const count = await this.helpCenterModel.find({ isactive: true }).countDocuments(findQuery.getQuery());
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

    async create(createHelpCenterDto: CreateHelpCenterDto, session: ClientSession) {
        let data = new this.helpCenterModel({
            title: createHelpCenterDto.title,
            description: createHelpCenterDto.description,
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

    async update(updateHelpCenterDto: UpdateHelpCenterDto, session: ClientSession) {
        const updateData = {
            title: updateHelpCenterDto.title,
            description: updateHelpCenterDto.description,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.helpCenterModel
                .findOneAndUpdate({ _id: updateHelpCenterDto.id }, updateData, {
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
            data = await this.helpCenterModel.findById(id).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The Category  with this id does not exist`);
        }
        return data;
    }
    async delete(updateHelpCenterDto: UpdateHelpCenterDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.helpCenterModel
                .findOneAndUpdate({ _id: updateHelpCenterDto.id }, updateData, {
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
