import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Package, PackageSchema } from '../../entities/package.entity';
import { PackageRepository } from '../../repositories/package.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }])],
    controllers: [PackageController],
    providers: [PackageService, PackageRepository,JwtGuard, JwtStrategy],
    exports: [PackageService, PackageRepository],
})
export class PackageModule {}
