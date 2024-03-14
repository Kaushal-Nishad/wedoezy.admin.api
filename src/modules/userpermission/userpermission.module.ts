import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from 'src/entities/permission.entity';
import { UserPermission, UserPermissionSchema } from 'src/entities/userpermission.entity';
import { UserPermissionRepository } from 'src/repositories/userpermission.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { UserPermissionController } from './userpermission.controller';
import { UserPermissionService } from './userpermission.service';


@Module({
    imports: [ MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema },{ name: UserPermission.name, schema: UserPermissionSchema }])],
    controllers: [UserPermissionController],
    providers: [UserPermissionService, UserPermissionRepository,JwtGuard, JwtStrategy],
    exports: [UserPermissionService, UserPermissionRepository],
})
export class UserPermissionModule {}