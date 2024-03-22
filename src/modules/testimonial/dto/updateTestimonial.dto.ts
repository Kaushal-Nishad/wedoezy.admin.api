import { PartialType } from '@nestjs/mapped-types';
import { CreateTestimonialDto } from './createTestimonial.dto';

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}