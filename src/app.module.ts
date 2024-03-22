import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PermissionModule } from './modules/permission/permission.module';
import { UserPermissionModule } from './modules/userpermission/userpermission.module';
import { CategoryModule } from './modules/category/category.module';
import { EnquiryModule } from './modules/enquiry/enquiry.module';
import { HelpCenterModule } from './modules/helpcenter/helpcenter.module';
import { FaqModule } from './modules/faq/faq.module';
import { BlogModule } from './modules/blog/blog.module';
import { OurServiceModule } from './modules/ourservices/ourservice.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { TestimonialModule } from './modules/testimonial/testimonial.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'files'),
  }),
  ConfigModule,
  ConfigModule.forRoot({
      isGlobal: true,
  }),
  MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
          uri: process.env.MONGODB_URI, // Loaded from .ENV
      }),
  }),
  AuthModule,
  UserModule,
  PermissionModule,
  UserPermissionModule,
  CategoryModule,
  EnquiryModule,
  HelpCenterModule,
  FaqModule,
  BlogModule,
  OurServiceModule,
  CartModule,
  OrderModule,
  TestimonialModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
