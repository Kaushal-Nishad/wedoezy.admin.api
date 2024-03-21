import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDto } from 'src/modules/order/dto/createOrder.dto';
import { UpdateOrderDto } from 'src/modules/order/dto/updateOrder.dto';
import { getCurrentDatetime, getSortParam, validurlcreater } from 'src/shared/utils';

export class OrderRepository {
    constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {}
    async get(query: GetQueryDto) {
        let data: Order[];

        try {
            const findQuery = this.orderModel
                .find({ isactive: true })
                .skip(Number(query.from) * Number(query.limit))
                .sort(getSortParam(query))
                .select('-isactive -isdeleted -createdAt');

            if (query.limit > 0) {
                findQuery.limit(Number(query.limit));
            }

            data = await findQuery;
            const count = await this.orderModel.find({ isactive: true }).countDocuments(findQuery.getQuery());
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

    async create(createOrderDto: CreateOrderDto, session: ClientSession) {
        let data = new this.orderModel({
            orderid: createOrderDto.orderid,
            orderdetails: createOrderDto.orderdetails,
            orderstatus : createOrderDto.orderstatus,
            partnerid: createOrderDto.partnerid,
            userid: createOrderDto.userid,
            usertype: createOrderDto.usertype,
            description: createOrderDto.description,
            appointment_date: createOrderDto.appointmentdate,
            appointment_time: createOrderDto.appointmenttime,
            firstname: createOrderDto.firstname,
            lastname: createOrderDto.lastname,
            email: createOrderDto.email,
            address: createOrderDto.address,
            country: createOrderDto.country,
            phone : createOrderDto.phone,
            pincode: createOrderDto.pincode,
            city: createOrderDto.city,
            state: createOrderDto.state,
            ammount: createOrderDto.paymentamount,
            payment_method: createOrderDto.paymentmethod,
            payment_status: createOrderDto.paymentstatus,
            mode: createOrderDto.mode,
            tranid: createOrderDto.tranid,
            transaction_id: createOrderDto.transactionid,
            paymentid:createOrderDto.paymentid,
            reason: createOrderDto.reason,
            note: createOrderDto.note,
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

    async update(updateOrderDto: UpdateOrderDto, session: ClientSession) {
        const updateData = {
            orderid: updateOrderDto.orderid,
            orderdetails: updateOrderDto.orderdetails,
            orderstatus : updateOrderDto.orderstatus,
            partnerid: updateOrderDto.partnerid,
            userid: updateOrderDto.userid,
            usertype: updateOrderDto.usertype,
            description: updateOrderDto.description,
            appointment_date: updateOrderDto.appointmentdate,
            appointment_time: updateOrderDto.appointmenttime,
            firstname: updateOrderDto.firstname,
            lastname: updateOrderDto.lastname,
            email: updateOrderDto.email,
            address: updateOrderDto.address,
            country: updateOrderDto.country,
            phone : updateOrderDto.phone,
            pincode: updateOrderDto.pincode,
            city: updateOrderDto.city,
            state: updateOrderDto.state,
            ammount: updateOrderDto.paymentamount,
            payment_method: updateOrderDto.paymentmethod,
            payment_status: updateOrderDto.paymentstatus,
            mode: updateOrderDto.mode,
            tranid: updateOrderDto.tranid,
            transaction_id: updateOrderDto.transactionid,
            paymentid:updateOrderDto.paymentid,
            reason: updateOrderDto.reason,
            note: updateOrderDto.note,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.orderModel
                .findOneAndUpdate({ _id: updateOrderDto.id }, updateData, {
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


    async assignOrder(updateOrderDto: UpdateOrderDto, session: ClientSession) {
        const updateData = {
            partnerid: updateOrderDto.partnerid,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.orderModel
                .findOneAndUpdate({ _id: updateOrderDto.id }, updateData, {
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

    async updateOrderStatus(updateOrderDto: UpdateOrderDto, activeuser: MongooseSchema.Types.ObjectId, session: ClientSession) {
        const updateData = {
            partnerid: updateOrderDto.partnerid,
            orderstatus : updateOrderDto.orderstatus,
            status_updated_by:activeuser,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.orderModel
                .findOneAndUpdate({ _id: updateOrderDto.id }, updateData, {
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
            data = await this.orderModel.findById(id).exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException(`The Category  with this id does not exist`);
        }
        return data;
    }
    async delete(updateOrderDto: UpdateOrderDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.orderModel
                .findOneAndUpdate({ _id: updateOrderDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Delete Order');
        }
        return data;
    }
}
