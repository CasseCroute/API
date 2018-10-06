import {Controller} from '@nestjs/common';
import {Client, ClientProxy, Transport} from '@nestjs/microservices';
import config from 'config';

@Controller()
export class RedisController {
	@Client({
		transport: Transport.REDIS,
		options: {
			url: `redis://${config.get('redis.host')}:${config.get('redis.port')}`,
		},
	})
	client: ClientProxy;
}
