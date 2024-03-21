import { PartialType } from "@nestjs/mapped-types";
import { CreateOurServiceDto } from "./createOurService.dto";

export class UpdateOurServiceDto extends PartialType(CreateOurServiceDto) {}