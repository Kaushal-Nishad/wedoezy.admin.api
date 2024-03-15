import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Faq, FaqSchema } from 'src/entities/faq.entity';
import { FaqRepository } from 'src/repositories/faq.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';


@Module({
    imports: [ MongooseModule.forFeature([{ name: Faq.name, schema: FaqSchema }])],
    controllers: [FaqController],
    providers: [FaqService, FaqRepository,JwtGuard, JwtStrategy],
    exports: [FaqService, FaqRepository],
})
export class FaqModule {}