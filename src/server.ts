import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import config from 'config';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(config.get('app.port'));
}

bootstrap()
	.then(() => console.log(`Server running at port ${config.get('app.port')}`))
	.catch(() => console.error('Server crashed...'));
