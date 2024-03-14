import { ConflictException, HttpException, HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { ChangePasswordDto, LoginDto, RegisterDTO, UpdateRegisterDTO } from 'src/modules/auth/dto/auth.dto';
import { addDays, getCurrentDatetime, getSortParam } from 'src/shared/utils';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../modules/user/dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { GetQueryDto } from 'src/dto/getQueryDto';
import { UpdateUserDto } from 'src/modules/user/dto/updateUser.dto';
import { UpdatePasswordDto } from 'src/modules/user/dto/updatePassword.dto';
import { UserPermission } from 'src/entities/userpermission.entity';
import { UserSetting } from 'src/entities/usersetting.entity';

export class UserRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(UserSetting.name) private readonly userSettingModel: Model<UserSetting>,
        @InjectModel(UserPermission.name) private readonly userPermissionModel: Model<UserPermission>,
    ) { }

    async create(createUserDto: CreateUserDto, session: ClientSession) {
        let data = await this.getUserByEmail(createUserDto.email);

        if (data) {
            throw new ConflictException('User already exists');
        }

        data = new this.userModel({
            name: createUserDto.name,
            email: createUserDto.email,
            mobile: createUserDto.mobile,
            role: createUserDto.role ? createUserDto.role : 'USER',
            password: await this.hashPassword(createUserDto.password),
        });

        try {
            //user = await user.save({ session });
            data = await data.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('User not created');
        }

        delete data.password;
        data.password = '';
        return data;
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, 12);
    }

    async registerAccount(createUserDto: RegisterDTO, session: ClientSession): Promise<User> {
        let data = await this.getUserByEmail(createUserDto.email);

        if (data) {
            throw new ConflictException('User already exists');
        }

        data = new this.userModel({
            name: createUserDto.name,
            email: createUserDto.email,
            mobile: createUserDto.mobile,
            role: 'USER',
            password: await this.hashPassword(createUserDto.password),
        });

        try {
            //user = await user.save({ session });
            data = await data.save();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('User not created');
        }
        delete data.password;
        data.password = '';
        return data;
        // return user.pipe(
        //     map((user: User) => {
        //       delete user.password;
        //       return user;
        //     }),
        //   );
    }

    // async login(loginDto: LoginDto, session: ClientSession): Promise<string> {
    //     let user = await this.validateUser(loginDto,session);
    //     if(!user){
    //         return
    //     }
    //     return "";
    // }

    async validateUser(loginDto: LoginDto, session: ClientSession) {
        let data = await this.userModel.findOne({
            isactive: true,
            role: { $in: ['ADMIN', 'USER'] },
            $or: [{ username: { $regex: '^' + loginDto.username + '$', $options: 'i' } }, { email: { $regex: '^' + loginDto.username + '$', $options: 'i' } }],
        }); //this.getUserByEmail(loginDto.username);

        if (!data) {
            throw new ConflictException('Invalid Credentials');
            // throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' }, HttpStatus.FORBIDDEN);
        }

        let isValidPassword = await bcrypt.compare(loginDto.password, data.password);
        if (isValidPassword) {
            return data;
        } else {
            throw new ConflictException('Invalid Credentials');
            // throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' }, HttpStatus.FORBIDDEN);
        }

        // return from(bcrypt.compare(loginDto.password, user.password)).pipe(
        //     map((isValidPassword: boolean) => {
        //         if (isValidPassword) {
        //             delete user.password;
        //             return user;
        //         }
        //     }),
        // );
        // try {
        //     //user = await user.save({ session });
        //     user = await user.save();
        // } catch (error) {
        //     throw new InternalServerErrorException(error);
        // }

        // if (!user) {
        //     throw new ConflictException('User not created');
        // }

        // return user;
    }

    async getUserPermissionById(id: MongooseSchema.Types.ObjectId) {
        let data;
        try {
            data = await this.userPermissionModel.find({ profileid: id }).populate('permissionid');
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return data;
    }

    async getUserById(id: MongooseSchema.Types.ObjectId) {
        let data;
        try {
            data = await this.userModel.findById({ _id: id });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new NotFoundException('User not found');
        }

        return data;
    }

    async getUserByEmail(email: string) {
        let data;
        try {
            data = await this.userModel.findOne({ $or: [{ username: email }, { email: email }] });
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return data;
    }

    async get(query: GetQueryDto) {
        let data: User[];

        try {
            const findQuery = this.userModel
                .find({ role: { $nin: ['USER', 'PARTNER'] }, isactive: true })
                .select('name email mobile role updatedAt username organisation')
                .skip(Number(query.from) * Number(query.limit))
                .sort(getSortParam(query));

            if (query.limit > 0) {
                findQuery.limit(Number(query.limit));
            }
            if (query.search) {
                findQuery.find({
                    $or: [
                        { name: { $regex: query.search, $options: 'i' } },
                        { email: { $regex: query.search, $options: 'i' } },
                        { mobile: { $regex: query.search, $options: 'i' } },
                    ],
                });
            }
            // if (query.categorytitle) {
            //     findQuery.find({ category: query.categorytitle });
            // }

            data = await findQuery;
            // const count = await this.userModel.find({ isactive: true }).count();
            const count = await this.userModel.find({ isactive: true }).countDocuments(findQuery.getQuery());
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

    async getAllUsers(query: GetQueryDto) {
        let data: User[];

        try {
            const findQuery = this.userModel
                .find({ role: { $in: ['USER', 'PARTNER'] }, isactive: true })
                .select('name email mobile role updatedAt username')
                .skip(Number(query.from) * Number(query.limit))
                .sort(getSortParam(query));

            if (query.downloadxl == 'Y') {
                query.from = query.limit = 0;
            }
            if (query.limit > 0) {
                findQuery.limit(Number(query.limit));
            }
            if (query.search) {
                findQuery.find({
                    $or: [
                        { name: { $regex: query.search, $options: 'i' } },
                        { email: { $regex: query.search, $options: 'i' } },
                        { mobile: { $regex: query.search, $options: 'i' } },
                    ],
                });
            }

            data = await findQuery;
            // const count = await this.userModel.find({ isactive: true }).count();
            const count = await this.userModel.find({ isactive: true }).countDocuments(findQuery.getQuery());
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

    async delete(updateUserDto: UpdateUserDto, session: ClientSession) {
        const updateData = {
            isactive: false,
            isdeleted: true,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.userModel
                .findOneAndUpdate({ _id: updateUserDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Delete User');
        }

        return data;
    }
    async getPartners(query: GetQueryDto) {
        let data: User[];

        try {
            const findQuery = this.userModel
                .find()
                .where({ isactive: true, role: 'PARTNER' })
                .skip(Number(query.from) * Number(query.limit))
                .sort(getSortParam(query));

            if (query.limit > 0) {
                findQuery.limit(Number(query.limit));
            }
            if (query.search) {
                findQuery.find({
                    $or: [
                        { name: { $regex: query.search, $options: 'i' } },
                        { email: { $regex: query.search, $options: 'i' } },
                        { mobile: { $regex: query.search, $options: 'i' } },
                    ],
                });
            }

            data = await findQuery;

            const count = await this.userModel.find().where({ isactive: true, role: 'PARTNER' }).countDocuments(findQuery.getQuery());

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

    async updateAccount(createUserDto: UpdateRegisterDTO, session: ClientSession): Promise<User> {
        let user = await this.getUserByEmail(createUserDto.email);
        if (!user) {
            throw new ConflictException('User Not exists');
        }
        const updateData = {
            name: createUserDto.name,
            email: createUserDto.email,
            mobile: createUserDto.mobile,
            role: 'USER',
        };
        let data;
        try {
            data = await this.userModel
                .findOneAndUpdate({ _id: user._id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException(`Error trying to update Student Registration!!!!`);
        }
        return data;
    }
    async update(updateUserDto: UpdateUserDto, session: ClientSession) {
        const updateData = {
            name: updateUserDto.name,
            email: updateUserDto.email,
            mobile: updateUserDto.mobile,
            role: updateUserDto.role ? updateUserDto.role : 'USER',
            // password: await this.hashPassword(updateUserDto.password),
            address: updateUserDto.address,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.userModel
                .findOneAndUpdate({ _id: updateUserDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Delete User');
        }
        data.password = '';
        return data;
    }

    async changepassword(changePasswordDto: ChangePasswordDto, session: ClientSession) {
        let user = await this.getUserById(changePasswordDto.id);
        if (!user) {
            return 'User not found';
        }

        let isValidPassword = await bcrypt.compare(changePasswordDto.oldpassword, user.password);
        if (!isValidPassword) {
            return 'Old Password Does Not Match';
        }

        const updateData = {
            password: await this.hashPassword(changePasswordDto.password),
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.userModel
                .findOneAndUpdate({ _id: changePasswordDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Update Password');
        }
        data.password = '';
        return data;
    }

    async resetpassword(updatePasswordDto: UpdatePasswordDto) {
        let user = await this.getUserById(updatePasswordDto.id);
        if (!user) {
            return 'User not found';
        }

        const updateData = {
            password: await this.hashPassword(updatePasswordDto.password),
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.userModel
                .findOneAndUpdate({ _id: updatePasswordDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Update Password');
        }
        data.password = '';
        return data;
    }

    async updateusername(updateUserDto: UpdateUserDto, session: ClientSession) {
        let CheckUser = await this.getUserByEmail(updateUserDto.username);

        if (CheckUser) {
            throw new ConflictException('User already exists');
        }
        const updateData = {
            username: updateUserDto.username,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.userModel
                .findOneAndUpdate({ _id: updateUserDto.id }, updateData, {
                    new: true,
                })
                //.session(session)
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Update Password');
        }
        data.password = '';
        return data;
    }
    async updateemail(updateUserDto: UpdateUserDto, session: ClientSession) {
        const updateData = {
            email: updateUserDto.email,
            isactive: true,
            isdeleted: false,
            updatedAt: getCurrentDatetime(),
        };

        let data;
        try {
            data = await this.userModel
                .findOneAndUpdate({ _id: updateUserDto.id }, updateData, {
                    new: true,
                })
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!data) {
            throw new ConflictException('Error trying to Update Email');
        }
        data.password = '';
        return data;
    }

    async updaterefreshToken(id: MongooseSchema.Types.ObjectId, refreshToken: string) {
        const updata = {
            refreshToken: refreshToken,
        };
        return await this.userModel.findByIdAndUpdate(id, updata, { new: true });
    }
}
