import {Module} from '@nestjs/common';
import {RedisController} from '@letseat/interfaces/tcp/modules/redis/redis.controller';

@Module({
	imports: [RedisController]
})
export class TCPCoreModule {
}
