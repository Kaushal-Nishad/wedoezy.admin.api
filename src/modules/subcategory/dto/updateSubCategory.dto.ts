import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './createSubCategory.dto';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}