import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Service } from 'src/entities/service.entity';
import { CreateOurServiceDto } from 'src/modules/ourservices/dto/createOurService.dto';
import { UpdateOurServiceDto } from 'src/modules/ourservices/dto/updateOurService.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';

export class OurServiceRepository {
    constructor(@InjectModel(Service.name) private readonly serviceModel: Model<Service>) {}
    async get(query: GetQueryDto) {
        let data: Service[];

        try {
            const findQuery = this.serviceModel
                .find({ isactive: true })
                .populate('category', 'title')
                .populate('subcategory', 'title')
                .populate('innersubcategory', 'title')
                .select('-isactive -isdeleted -createdAt -lastactivityby')
                .skip(Number(query.from) * Number(query.limit))
                .sort(getSortParam(query));

            if (query.limit > 0) {
                findQuery.limit(Number(query.limit));
            }
            if (query.search) {
                findQuery.find({ $or: [{ title: { $regex: query.search, $options: 'i' } }] });
            }

            if (query.category && query.category.length > 0) {
                findQuery.find({ category: { $in: query.category } });
            }

            if (query.subcategory && query.subcategory.length > 0) {
                findQuery.find({ subcategory: { $in: query.subcategory } });
            }

            if (query.innersubcategory && query.innersubcategory.length > 0) {
                findQuery.find({ innersubcategory: { $in: query.innersubcategory } });
            }

            data = await findQuery;
            const count = await this.serviceModel.find({ isactive: true }).countDocuments(findQuery.getQuery());

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
    async create(createServiceDto: CreateOurServiceDto, session: ClientSession) {
        const cslug = createServiceDto.title.replace(/\s+/g, '-').toLowerCase().trim();
        let data = new this.serviceModel({
            title: createServiceDto.title,
            slug: cslug,
            type: createServiceDto.type,
            description: createServiceDto.description,
            categoryid: createServiceDto.categoryid,
            subcategoryid: createServiceDto.subcategoryid,
            innersubcategoryid: createServiceDto.innersubcategoryid,
            image: createServiceDto.image,
            price: createServiceDto.price,
            discount: createServiceDto.discount,
            dis_price: createServiceDto.discountprice,
            duration: createServiceDto.deration,
            package_discription: createServiceDto.packagedescription,
            start_time: createServiceDto.starttime,
            end_time: createServiceDto.endtime,
            video_link: createServiceDto.videolink,
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

    async update(updateServiceDto: UpdateOurServiceDto, session: ClientSession) {
        const cslug = updateServiceDto.title.replace(/\s+/g, '-').toLowerCase().trim();
        let updateData = {
            title: updateServiceDto.title,
            slug : cslug,
            type: updateServiceDto.type,
            description: updateServiceDto.description,
            categoryid: updateServiceDto.categoryid,
            subcategoryid: updateServiceDto.subcategoryid,
            innersubcategoryid: updateServiceDto.innersubcategoryid,
            image: updateServiceDto.image,
            price: updateServiceDto.price,
            discount: updateServiceDto.discount,
            dis_price: updateServiceDto.discountprice,
            duration: updateServiceDto.deration,
            package_discription: updateServiceDto.packagedescription,
            start_time: updateServiceDto.starttime,
            end_time: updateServiceDto.endtime,
            video_link: updateServiceDto.videolink,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };
        let data;
        try {
            data = await this.serviceModel
                .findOneAndUpdate({ _id: updateServiceDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Service`);
        }

        return data;
    }
    async updateFileInService(id: MongooseSchema.Types.ObjectId, file: string, session: ClientSession) {
        let updateData = {
            image: file,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };
        let data;
        try {
            data = await this.serviceModel
                .findOneAndUpdate({ _id: id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Service`);
        }

        return data;
    }

    async getById(id: MongooseSchema.Types.ObjectId) {
        let data;
        try {
            data = await this.serviceModel.findById(id).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The Service with this id does not exist`);
        }

        return data;
    }
    async delete(updateServiceDto: UpdateOurServiceDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.serviceModel
                .findOneAndUpdate({ _id: updateServiceDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to Delete Faq's`);
        }
        return data;
    }
}
