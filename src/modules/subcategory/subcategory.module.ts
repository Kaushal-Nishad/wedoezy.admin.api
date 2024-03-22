import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, SubCategorySchema } from 'src/entities/subcategory.entity';
import { SubCategoryRepository } from 'src/repositories/subcategory.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { SubCategoryController } from './subcategory.controller';
import { SubCategoryService } from './subcategory.service';


@Module({
    imports: [ MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema }])],
    controllers: [SubCategoryController],
    providers: [SubCategoryService, SubCategoryRepository,JwtGuard, JwtStrategy],
    exports: [SubCategoryService, SubCategoryRepository],
})
export class SubCategoryModule {}