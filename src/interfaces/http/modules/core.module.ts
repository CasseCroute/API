import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {StoreModule} from '@letseat/interfaces/http/modules/store/store.module';
import {CustomerModule} from '@letseat/interfaces/http/modules/customer/customer.module';
import {TimeoutInterceptor} from '@letseat/application/queries/common/interceptors/timeout.interceptor';
import {TransformInterceptor} from '@letseat/application/queries/common/interceptors/transform.interceptor';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
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
