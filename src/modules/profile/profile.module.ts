import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entities/user.entity';
import { UserPermission, UserPermissionSchema } from 'src/entities/userpermission.entity';
import {  UserSetting, UserSettingSchema } from 'src/entities/usersetting.entity';
import { ProfileRepository } from 'src/repositories/profile.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
@Module({
    imports: [ MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: UserPermission.name, schema: UserPermissionSchema },
        { name: UserSetting.name, schema: UserSettingSchema },
       ])],
    controllers: [ProfileController],
    providers: [ProfileService, ProfileRepository,UserRepository, JwtGuard, JwtStrategy],
    exports: [ProfileService, ProfileRepository],
})
export class ProfileModule {}