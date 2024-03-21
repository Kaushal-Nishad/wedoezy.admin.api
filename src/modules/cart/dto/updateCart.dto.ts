import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './createCart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {}