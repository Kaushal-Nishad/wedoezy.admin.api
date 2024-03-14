import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Package } from 'src/entities/package.entity';
import { CreatePackageDto } from 'src/modules/package/dto/createPackage.dto';
import { UpdatePackageDto } from 'src/modules/package/dto/updatePackage.dto';
import { getCurrentDatetime, getSortParam } from 'src/shared/utils';

export class PackageRepository {
    constructor(@InjectModel(Package.name) private readonly packageModel: Model<Package>) {}

    async get(query: GetQueryDto) {
        let data: Package[];

        try {
            const findQuery = this.packageModel
                .find({ isactive: true })
                .populate('categoryid','title')
                .select('-isactive -isdeleted -lastactivityby -createdAt -updatedAt')
                .skip(Number(query.from) * Number(query.limit))
                .sort(getSortParam(query));

            if (query.limit > 0) {
                findQuery.limit(Number(query.limit));
            }
            if (query.search) {
                findQuery.find({
                    $or: [
                        { packagename: { $regex: query.search, $options: 'i' } },
                        { type: { $regex: query.search, $options: 'i' } },
                    ],
                });
            }
            data = await findQuery;
            //const count = await this.packageModel.find({ isactive: true }).count();
            const count = await this.packageModel.find({ isactive: true }).countDocuments(findQuery.getQuery());

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
    async getpackagenotsale() {
        let data: Package[];

        try {
            const findQuery = this.packageModel
                .find({ isactive: true ,isforsale:false});

            data = await findQuery;
            return {
                ok: true,
                data: data,
                filtercount: data.length,
                message: `Success`,
            };
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async create(createPackageDto: CreatePackageDto, activeuser: MongooseSchema.Types.ObjectId, session: ClientSession) {
        let packagedata = await this.packageModel.find({ categoryid: createPackageDto.categoryid, maxcourse: createPackageDto.maxcourse }).exec();
        if (packagedata && packagedata.length > 0) {
            throw new ConflictException(`Packages already exist.`);
        }
        let data = new this.packageModel({
            type: createPackageDto.type,
            packagename: createPackageDto.packagename,
            packageid: createPackageDto.packageid,
            price: createPackageDto.price,
            sellingprice: createPackageDto.sellingprice,
            ispaid: createPackageDto.ispaid,
            lastactivityby: activeuser,
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
    async update(updatePackageDto: UpdatePackageDto, session: ClientSession) {
        let packagedata = await this.packageModel
            .find({
                _id: {
                    $ne: updatePackageDto.id,
                },
            })
            .exec();
        if (packagedata && packagedata.length > 0) {
            throw new ConflictException(`Packages already exist.`);
        }
        const updateData = {
            type: updatePackageDto.type,
            packagename: updatePackageDto.packagename,
            packageid: updatePackageDto.packageid,
            price: updatePackageDto.price,
            sellingprice: updatePackageDto.sellingprice,
            ispaid: updatePackageDto.ispaid,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.packageModel
                .findOneAndUpdate({ _id: updatePackageDto.id }, updateData, {
                    new: true,
                })
                // .session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Package`);
        }

        return data;
    }

    async getById(id: MongooseSchema.Types.ObjectId) {
        let data;
        try {
            data = await this.packageModel.findById(id).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The Package with this id does not exist`);
        }

        return data;
    }
    async delete(updatePackageDto: UpdatePackageDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.packageModel
                .findOneAndUpdate({ _id: updatePackageDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Delete Package');
        }
        return data;
    }
}
