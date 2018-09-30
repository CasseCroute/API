import {NestFactory} from '@nestjs/core';
import {CoreModule} from './app/core.module';
import config from 'config';
import dotenv from 'dotenv';
import {CustomExceptionFilter, LoggerService} from '@common';
const logger = new LoggerService('Server');

dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(CoreModule, {
		logger
	});
	app.useGlobalFilters(new CustomExceptionFilter());
	await app.listen(config.get('app.port'));
}

bootstrap()
	.then(() => logger.log(`Server running at port ${config.get('app.port')}`))
	.catch(() => logger.error('Server crashed !'));
