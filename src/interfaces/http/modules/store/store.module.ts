import {Module, OnModuleInit} from '@nestjs/common';
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
import {StoreContollers} from '@letseat/interfaces/http/modules/store/controllers';
import {ProductCommandHandlers} from '@letseat/application/commands/product/handlers';
import {MealCommandHandlers} from '@letseat/application/commands/meal/handlers';
import {MealsQueryHandlers} from '@letseat/application/queries/meal/handlers';
import {SectionCommandHandlers} from '@letseat/application/commands/section/handlers';
import {ProductIngredientRepository} from '@letseat/infrastructure/repository/product-ingredient.repository';
import {LoggerService} from '@letseat/infrastructure/services';

@Module({
	imports: [
		TypeOrmModule.forFeature([Store, StoreRepository, ProductIngredientRepository]),
		CQRSModule
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
		LoggerService
	],
	controllers: [
		...StoreContollers
	]
})
export class StoreModule implements OnModuleInit {
	constructor(
		private readonly moduleRef: ModuleRef,
		private readonly command$: CommandBus,
	) {}

	onModuleInit() {
		this.command$.setModuleRef(this.moduleRef);

		this.command$.register(StoreCommandHandlers);
		this.command$.register(IngredientCommandHandlers);
		this.command$.register(StoreQueryHandlers);
		this.command$.register(ResourceQueryHandlers);
		this.command$.register(ProductCommandHandlers);
		this.command$.register(MealCommandHandlers);
		this.command$.register(SectionCommandHandlers);
	}
}
