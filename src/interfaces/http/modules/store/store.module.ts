import {Module, MulterModule, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {ModuleRef} from '@nestjs/core';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';
import {StoreCommandHandlers} from '@letseat/application/commands/store/handlers';
import {StoreQueryHandlers} from '@letseat/application/queries/store/handlers';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {ResourceQueryHandlers} from '@letseat/application/queries/resource/handlers';
import {IngredientCommandHandlers} from '@letseat/application/commands/ingredient/handlers';
import {StoreControllers} from '@letseat/interfaces/http/modules/store/controllers';
import {ProductCommandHandlers} from '@letseat/application/commands/product/handlers';
import {MealCommandHandlers} from '@letseat/application/commands/meal/handlers';
import {MealsQueryHandlers} from '@letseat/application/queries/meal/handlers';
import {SectionCommandHandlers} from '@letseat/application/commands/section/handlers';
import {VoucherCommandHandlers} from '@letseat/application/commands/voucher/handlers';
import {VoucherQueryHandlers} from '@letseat/application/queries/voucher/handlers';
import {ProductIngredientRepository} from '@letseat/infrastructure/repository/product-ingredient.repository';
import {LoggerService} from '@letseat/infrastructure/services';
import {OrderCommandHandlers} from '@letseat/application/commands/order/handlers';
import {OrderRepository} from '@letseat/infrastructure/repository/order.repository';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {GeocoderService} from '@letseat/infrastructure/services/geocoder.service';
import {VoucherRepository} from '@letseat/infrastructure/repository/voucher.repository';
import {AWSService} from '@letseat/infrastructure/services/aws.service';
import {MulterConfigService} from '@letseat/infrastructure/services/multer.service';
import {MealRepository} from '@letseat/infrastructure/repository/meal.repository';
import {ProductRepository} from '@letseat/infrastructure/repository/product.repository';
import {CartRepository} from '@letseat/infrastructure/repository/cart.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Store,
			StoreRepository,
			ProductIngredientRepository,
			OrderRepository,
			CustomerRepository,
			VoucherRepository,
			MealRepository,
			ProductRepository,
			CartRepository
		]),
		CQRSModule,
		MulterModule.registerAsync({
			useClass: MulterConfigService
		}),
	],
	providers: [
		JwtStrategy,
		...ResourceQueryHandlers,
		...StoreCommandHandlers,
		...StoreQueryHandlers,
		...IngredientCommandHandlers,
		...ProductCommandHandlers,
		...MealCommandHandlers,
		...MealsQueryHandlers,
		...SectionCommandHandlers,
		...OrderCommandHandlers,
		...VoucherCommandHandlers,
		...VoucherQueryHandlers,
		GeocoderService,
		LoggerService,
		AWSService,
	],
	controllers: [
		...StoreControllers
	]
})
export class StoreModule implements OnModuleInit {
	constructor(
		private readonly moduleRef: ModuleRef,
		private readonly command$: CommandBus,
	) {
	}

	onModuleInit() {
		this.command$.setModuleRef(this.moduleRef);

		this.command$.register(StoreCommandHandlers);
		this.command$.register(IngredientCommandHandlers);
		this.command$.register(StoreQueryHandlers);
		this.command$.register(ResourceQueryHandlers);
		this.command$.register(ProductCommandHandlers);
		this.command$.register(MealCommandHandlers);
		this.command$.register(SectionCommandHandlers);
		this.command$.register(OrderCommandHandlers);
		this.command$.register(VoucherCommandHandlers);
		this.command$.register(VoucherQueryHandlers);
	}
}
