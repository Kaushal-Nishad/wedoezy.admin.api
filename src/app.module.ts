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
  UserPermissionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
