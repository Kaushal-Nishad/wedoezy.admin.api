import { PartialType } from '@nestjs/mapped-types';
import { CreateUserPermissionDto } from './createUserPermission.dto';

export class UpdateUserPermissionDto extends PartialType(CreateUserPermissionDto) {}