import { PartialType } from '@nestjs/mapped-types';
import { CreateHelpCenterDto } from './createHelpCenter.dto';

export class UpdateHelpCenterDto extends PartialType(CreateHelpCenterDto) {}