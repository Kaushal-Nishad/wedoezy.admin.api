import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Service, ServiceSchema } from '../../entities/service.entity';
import { OurServiceRepository } from '../../repositories/ourservice.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { ServiceController } from './ourservice.controller';
import { OurServiceService } from './ourservice.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }])],
    controllers: [ServiceController],
    providers: [OurServiceService, OurServiceRepository,JwtGuard, JwtStrategy],
    exports: [OurServiceService, OurServiceRepository],
})
export class OurServiceModule {}
