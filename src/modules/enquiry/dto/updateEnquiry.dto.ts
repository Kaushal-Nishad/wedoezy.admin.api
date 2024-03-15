import { PartialType } from '@nestjs/mapped-types';
import { CreateEnquiryDto } from './createEnquiry.dto';

export class UpdateEnquiryDto extends PartialType(CreateEnquiryDto) {}