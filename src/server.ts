import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap()
  .then(() => console.log('Server running...'))
  .catch(() => console.error('Server crashed...'));
