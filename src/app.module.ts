import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
