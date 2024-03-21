import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from 'src/modules/category/dto/createCategory.dto';
import { UpdateCategoryDto } from 'src/modules/category/dto/updateCategory.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';

export class CategoryRepository {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {}
    async get(query: GetQueryDto) {
        let data: Category[];

        try {
            const findQuery = this.categoryModel
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
            if (query.categorytitle) {
                findQuery.find({ category: query.categorytitle });
            }

            data = await findQuery;
            const count = await this.categoryModel.find({ isactive: true }).countDocuments(findQuery.getQuery());
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

    async create(createCategoryDto: CreateCategoryDto, session: ClientSession) {
        const cslug = createCategoryDto.title.replace(/\s+/g, '-').toLowerCase().trim();
        let data = new this.categoryModel({
            title: createCategoryDto.title,
            slug: cslug,
            image: createCategoryDto.image,
            icon_image: createCategoryDto.image,
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

    async update(updateCategoryDto: UpdateCategoryDto, session: ClientSession) {
        const cslug = updateCategoryDto.title.replace(/\s+/g, '-').toLowerCase().trim();
        const updateData = {
            title: updateCategoryDto.title,
            slug : cslug,
            image: updateCategoryDto.image,
            icon_image: updateCategoryDto.image,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.categoryModel
                .findOneAndUpdate({ _id: updateCategoryDto.id }, updateData, {
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

    async updateFileInCategory(id: MongooseSchema.Types.ObjectId, files: string[], session: ClientSession) {
        let updateData = {
            image: files[0],
            icon_image: files.length>1? files[1]:'',
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };
        let data;
        try {
            data = await this.categoryModel
                .findOneAndUpdate({ _id: id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Course`);
        }

        return data;
    }

    async getById(id: MongooseSchema.Types.ObjectId) {
        let data;
        try {
            data = await this.categoryModel.findById(id).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The Category  with this id does not exist`);
        }
        return data;
    }
    async delete(updateCategoryDto: UpdateCategoryDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.categoryModel
                .findOneAndUpdate({ _id: updateCategoryDto.id }, updateData, {
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
