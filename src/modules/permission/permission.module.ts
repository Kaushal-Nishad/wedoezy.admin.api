import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from 'src/entities/permission.entity';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';


@Module({
    imports: [ MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }])],
    controllers: [PermissionController],
    providers: [PermissionService, PermissionRepository,JwtGuard, JwtStrategy],
    exports: [PermissionService, PermissionRepository],
})
export class PermissionModule {}