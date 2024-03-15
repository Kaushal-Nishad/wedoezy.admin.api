import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelpCenter, HelpCenterSchema } from 'src/entities/helpcenter.entity';
import { HelpCenterRepository } from 'src/repositories/helpcenter.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { HelpCenterController } from './helpcenter.controller';
import { HelpCenterService } from './helpcenter.service';


@Module({
    imports: [ MongooseModule.forFeature([{ name: HelpCenter.name, schema: HelpCenterSchema }])],
    controllers: [HelpCenterController],
    providers: [HelpCenterService, HelpCenterRepository,JwtGuard, JwtStrategy],
    exports: [HelpCenterService, HelpCenterRepository],
})
export class HelpCenterModule {}