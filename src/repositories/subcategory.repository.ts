import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { SubCategory } from 'src/entities/subcategory.entity';
import { CreateSubCategoryDto } from 'src/modules/subcategory/dto/createSubCategory.dto';
import { UpdateSubCategoryDto } from 'src/modules/subcategory/dto/updateSubCategory.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';

export class SubCategoryRepository {
    constructor(@InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategory>) {}
    async get(query: GetQueryDto) {
        let data: SubCategory[];

        try {
            const findQuery = this.subCategoryModel
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
            const count = await this.subCategoryModel.find({ isactive: true }).countDocuments(findQuery.getQuery());
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

    async create(createSubCategoryDto: CreateSubCategoryDto, session: ClientSession) {
        const cslug = createSubCategoryDto.title.replace(/\s+/g, '-').toLowerCase().trim();
        let data = new this.subCategoryModel({
            categoryid: createSubCategoryDto.categoryid,
            title: createSubCategoryDto.title,
            description: createSubCategoryDto.description,
            slug: cslug,
            isactive: true,
            isdeleted: false,
        });

        try {
            // contactUs = await contactUs.save({ session });
            data = await data.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
        return data;
    }

    async update(updateSubCategoryDto: UpdateSubCategoryDto, session: ClientSession) {
        const cslug = updateSubCategoryDto.title.replace(/\s+/g, '-').toLowerCase().trim();
        const updateData = {
            categoryid: updateSubCategoryDto.categoryid,
            title: updateSubCategoryDto.title,
            description: updateSubCategoryDto.description,
            slug : cslug,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.subCategoryModel
                .findOneAndUpdate({ _id: updateSubCategoryDto.id }, updateData, {
                    new: true,
                })
                // .session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update SubCategory`);
        }

        return data;
    }

    async updateImage(id: MongooseSchema.Types.ObjectId, file: string, session: ClientSession) {
        let updateData = {
            image : file ? file : null,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };
        let data;
        try {
            data = await this.subCategoryModel
                .findOneAndUpdate({ _id: id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Category`);
        }

        return data;
    }

    async updateLogos(id: MongooseSchema.Types.ObjectId, files: string[], session: ClientSession) {
        let updateData = {
            logo1 : files[0] ? files[0] : null,
            logo2 : files[1] ? files[1] : null,
            logo3 : files[2] ? files[2] : null,
            logo4 : files[3] ? files[3] : null,
            logo5 : files[4] ? files[4] : null,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };
        let data;
        try {
            data = await this.subCategoryModel
                .findOneAndUpdate({ _id: id }, updateData, {
                    new: true,
                })
                //.session(session)
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
            data = await this.subCategoryModel.findById(id).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The SubCategory  with this id does not exist`);
        }
        return data;
    }
    async delete(updateSubCategoryDto: UpdateSubCategoryDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.subCategoryModel
                .findOneAndUpdate({ _id: updateSubCategoryDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Delete SubCategory');
        }
        return data;
    }
}
