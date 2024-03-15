import { PartialType } from '@nestjs/mapped-types';
import { CreateFaqDto } from './createFaq.dto';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {}