import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Only enable if necessary
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties
      forbidNonWhitelisted: true, // Throw an error if unknown property is found
      transform: true, // Automatically transform payloads to DTO instances
      errorHttpStatusCode: 422, // Change the default status code when validation fails
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Food Ordering API')
    .setDescription('API documentation for the online food ordering system')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(`${process.env.PORT}` || 3001);
}
bootstrap();
