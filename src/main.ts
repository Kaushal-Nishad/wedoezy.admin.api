import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { HttpExceptionFilter } from './exception/http-exception.filter';
import * as bodyParser from 'body-parser';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.enableCors();

    app.useGlobalFilters(new HttpExceptionFilter);
    app.setGlobalPrefix('api');

    const config = new ConfigService();
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const configswager = new DocumentBuilder().setTitle('WeDoEzy APIs').setDescription('The WeDoEzy APIs API description').setVersion('1.0').addTag('cats').build();
  const document = SwaggerModule.createDocument(app, configswager, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(await config.getPortConfig());

  if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
}
bootstrap();
