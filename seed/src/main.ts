import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './infrastructure/database/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundInterceptor } from './presentation/nest/custom-interceptors/working-shifts.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const apiVersion = process.env.API_VERSION ?? '1.0';
const apiName = process.env.API_NAME ?? 'apiName';
const apiDesc = process.env.API_DESCRIPTION ?? 'apiDesc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new NotFoundInterceptor());

  const config = new DocumentBuilder()
    .setTitle(apiName)
    .setDescription(apiDesc)
    .setVersion(apiVersion)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
