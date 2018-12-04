import {NestFactory} from '@nestjs/core';
import config from 'config';
import dotenv from 'dotenv';
import {HTTPCoreModule} from '@letseat/interfaces/http/modules/http.core.module';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';
import {Transport} from '@nestjs/microservices';
import helmet from 'helmet';
import {LoggerService} from '@letseat/infrastructure/services';
import {EventEmitter} from 'events';
import compression from 'compression';

const logger = new LoggerService('Server');
const emitter = new EventEmitter();

dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(HTTPCoreModule, {
		logger
	});

	const redisMicroservice = app.connectMicroservice({
		transport: Transport.REDIS,
		options: {
			retryAttempts: 5, retryDelay: 3000,
			url: `redis://${config.get('redis.host')}:${config.get('redis.port')}`,
		}
	});

	app.use(helmet());
	app.use(compression());
	app.enableCors();

	app.useGlobalFilters(new CustomExceptionFilter());

	await app.startAllMicroservicesAsync();
	await app.listen(config.get('app.port'));
	await app.init();

	redisMicroservice.listen(() => {
		logger.log(`Redis microservice is listening at port ${config.get('redis.port')}`);
	});
}

bootstrap()
	.then(() => {
		emitter.setMaxListeners(0);
		return logger.log(`Server running at port ${config.get('app.port')}`);
	})
	.catch(err => logger.error('Server crashed !', err));
