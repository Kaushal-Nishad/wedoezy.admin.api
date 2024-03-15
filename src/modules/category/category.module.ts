import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/entities/category.entity';
import { CategoryRepository } from 'src/repositories/category.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';


@Module({
    imports: [ MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryRepository,JwtGuard, JwtStrategy],
    exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}