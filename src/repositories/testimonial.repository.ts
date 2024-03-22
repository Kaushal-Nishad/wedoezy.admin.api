import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Testimonial } from 'src/entities/testimonial.entity';
import { CreateTestimonialDto } from 'src/modules/testimonial/dto/createTestimonial.dto';
import { UpdateTestimonialDto } from 'src/modules/testimonial/dto/updateTestimonial.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';

export class TestimonialRepository {
    constructor(@InjectModel(Testimonial.name) private readonly testimonialModel: Model<Testimonial>) {}
    async get(query: GetQueryDto) {
        let data: Testimonial[];

        try {
            const findQuery = this.testimonialModel
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
            const count = await this.testimonialModel.find({ isactive: true }).countDocuments(findQuery.getQuery());
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

    async create(createTestimonialDto: CreateTestimonialDto, session: ClientSession) {
        let data = new this.testimonialModel({
            title: createTestimonialDto.title,
            description: createTestimonialDto.description,
            designation: createTestimonialDto.designation,
            rating: createTestimonialDto.rating,
            image: createTestimonialDto.image,
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

    async update(updateTestimonialDto: UpdateTestimonialDto, session: ClientSession) {
        const updateData = {
            title: updateTestimonialDto.title,
            description: updateTestimonialDto.description,
            designation: updateTestimonialDto.designation,
            rating: updateTestimonialDto.rating,
            image: updateTestimonialDto.image,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.testimonialModel
                .findOneAndUpdate({ _id: updateTestimonialDto.id }, updateData, {
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

    async updateFileInTestimonial(id: MongooseSchema.Types.ObjectId, file: string, session: ClientSession) {
        let updateData = {
            image: file,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };
        let data;
        try {
            data = await this.testimonialModel
                .findOneAndUpdate({ _id: id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Testimonial`);
        }

        return data;
    }

    async getById(id: MongooseSchema.Types.ObjectId) {
        let data;
        try {
            data = await this.testimonialModel.findById(id).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The Category  with this id does not exist`);
        }
        return data;
    }
    async delete(updateTestimonialDto: UpdateTestimonialDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.testimonialModel
                .findOneAndUpdate({ _id: updateTestimonialDto.id }, updateData, {
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
