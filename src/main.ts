import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('pro-invertor')
    .setDescription('The pro-investor API description')
    .setVersion('1.0')
    .addTag('pro')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  const PORT = process.env.APP_PORT || 3001
  await app.listen(PORT, () => {
    console.log(`server running:http://localhost:${PORT}/api`);

  });
}
bootstrap();
