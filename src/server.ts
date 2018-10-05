import {NestFactory} from '@nestjs/core';
import config from 'config';
import dotenv from 'dotenv';
import {CoreModule} from '@letseat/interfaces/http/modules/core.module';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';
import {LoggerService} from '@letseat/application/queries/common/services';

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
