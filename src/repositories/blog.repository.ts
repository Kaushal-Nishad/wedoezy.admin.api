import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Blog } from 'src/entities/blog.entity';
import { CreateBlogDto } from 'src/modules/blog/dto/createBlog.dto';
import { UpdateBlogDto } from 'src/modules/blog/dto/updateBlog.dto';
import { getCurrentDatetime, getSortParam } from 'src/shared/utils';

export class BlogRepository {
    constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) {}
    async get(query: GetQueryDto) {
        let data: Blog[];

        try {
            const findQuery = this.blogModel
                .find({ isactive: true })
                .select('-createdAt -isactive -isdeleted -lastactivityby')
                .skip(Number(query.from) * Number(query.limit))
                .sort(getSortParam(query));

            if (query.limit > 0) {
                findQuery.limit(Number(query.limit));
            }
            if (query.search) {
                findQuery.find({ $or: [{ title: { $regex: query.search, $options: 'i' } }, { description: { $regex: query.search, $options: 'i' } }] });
            }
            if (query.categorytitle) {
                findQuery.find({ category: query.categorytitle });
            }   
            if (query.fromdate) {
                findQuery.find({ createdAt:{$lte: query.fromdate}});
            }

            data = await findQuery;
            //const count = await this.blogModel.find({ isactive: true }).count();
            const count = await this.blogModel.find({ isactive: true }).countDocuments(findQuery.getQuery());

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

    async create(createBlogDto: CreateBlogDto, activeuser: MongooseSchema.Types.ObjectId, session: ClientSession) {
        const cslug = createBlogDto.title.replace(/\s+/g, '-').toLowerCase().trim();

        let data = new this.blogModel({
            title: createBlogDto.title,
            slug: cslug,
            shortdescription:createBlogDto.shortdescription,
            description: createBlogDto.description,
            redirecturl: createBlogDto.redirecturl,
            imageurl: createBlogDto.imageurl,
            image: createBlogDto.image,
            date: getCurrentDatetime(),
            lastactivityby: activeuser,
            Url:createBlogDto.Url,
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

    async update(updateBlogDto: UpdateBlogDto, session: ClientSession) {
        const cslug = updateBlogDto.title.replace(/\s+/g, '-').toLowerCase().trim();

        const updateData = {
            title: updateBlogDto.title,
            shortdescription:updateBlogDto.shortdescription,
            description: updateBlogDto.description,
            slug: cslug,
            imageurl: updateBlogDto.imageurl,
            image:updateBlogDto.image,
            Url:updateBlogDto.Url,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.blogModel
                .findOneAndUpdate({ _id: updateBlogDto.id }, updateData, {
                    new: true,
                })
                // .session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Blog`);
        }

        return data;
    }
    async getById(id: MongooseSchema.Types.ObjectId) {
        let data;
        try {
            data = await this.blogModel.findById(id).select('-createdAt -isactive -isdeleted -lastactivityby').exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The Blog  with this id does not exist`);
        }

        return data;
    }
    async delete(updateBlogDto: UpdateBlogDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.blogModel
                .findOneAndUpdate({ _id: updateBlogDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Delete Blog');
        }
        return data;
    }
}
