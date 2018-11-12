import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {StoreModule} from '@letseat/interfaces/http/modules/store/store.module';
import {CustomerModule} from '@letseat/interfaces/http/modules/customer/customer.module';
import {
	ExcludeIdInterceptor,
	TimeoutInterceptor,
	TransformInterceptor
} from '@letseat/application/queries/common/interceptors';
import {APIKeyStrategy} from '@letseat/infrastructure/authorization/strategies/api-key.strategy';
import {IngredientModule} from '@letseat/interfaces/http/modules/ingredient/ingredient.module';
import {CuisineModule} from '@letseat/interfaces/http/modules/cuisine/cuisine.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		StoreModule,
		CustomerModule,
		IngredientModule,
		CuisineModule,
		APIKeyStrategy,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: TimeoutInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ExcludeIdInterceptor
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		}
	],
})
export class HTTPCoreModule {
}
