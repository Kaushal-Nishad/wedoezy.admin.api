import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/entities/blog.entity';
import { BlogRepository } from 'src/repositories/blog.repository';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';


@Module({
    imports: [ MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
    controllers: [BlogController],
    providers: [BlogService, BlogRepository,JwtGuard, JwtStrategy],
    exports: [BlogService, BlogRepository],
})
export class BlogModule {}