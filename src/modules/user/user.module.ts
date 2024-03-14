import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermission, UserPermissionSchema } from 'src/entities/userpermission.entity';
import { UserSetting, UserSettingSchema } from 'src/entities/usersetting.entity';

import { User, UserSchema } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
    { name: UserPermission.name, schema: UserPermissionSchema },
    { name: UserSetting.name, schema: UserSettingSchema },
    ])],
    controllers: [UserController],
    providers: [UserService, UserRepository, JwtGuard, JwtStrategy],
    exports: [UserService, UserRepository],
})
export class UserModule { }
