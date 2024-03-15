import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnquiryRepository } from 'src/repositories/enquiry.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { EnquiryController } from './enquiry.controller';
import { EnquiryService } from './enquiry.service';
import { Enquiry, EnquirySchema } from 'src/entities/enquiry.entity';


@Module({
    imports: [ MongooseModule.forFeature([{ name: Enquiry.name, schema: EnquirySchema }])],
    controllers: [EnquiryController],
    providers: [EnquiryService, EnquiryRepository,JwtGuard, JwtStrategy],
    exports: [EnquiryService, EnquiryRepository],
})
export class EnquiryModule {}