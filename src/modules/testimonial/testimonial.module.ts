import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Testimonial, TestimonialSchema } from 'src/entities/testimonial.entity';
import { TestimonialRepository } from 'src/repositories/testimonial.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';


@Module({
    imports: [ MongooseModule.forFeature([{ name: Testimonial.name, schema: TestimonialSchema }])],
    controllers: [TestimonialController],
    providers: [TestimonialService, TestimonialRepository,JwtGuard, JwtStrategy],
    exports: [TestimonialService, TestimonialRepository],
})
export class TestimonialModule {}