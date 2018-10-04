import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PhotoModule} from '@photo';
import {AppModule} from './app.module';
import {StoreModule} from '@store';
import {CustomerModule} from '@customer';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {TimeoutInterceptor} from './common/interceptors/timeout.interceptor';
import {TransformInterceptor} from './common/interceptors/transform.interceptor';

@Module({
	imports: [TypeOrmModule.forRoot(),
		AppModule,
		PhotoModule,
		StoreModule,
		CustomerModule
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: TimeoutInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
	],
})
export class CoreModule {
}
