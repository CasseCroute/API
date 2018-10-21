import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CommandBus, CQRSModule, EventBus} from '@nestjs/cqrs';
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

@Module({
	imports: [
		TypeOrmModule.forFeature([Store, StoreRepository]),
		CQRSModule
	],
	providers: [
		JwtStrategy,
		...ResourceQueryHandlers,
		...StoreCommandHandlers,
		...StoreQueryHandlers,
		...IngredientCommandHandlers,
		...ProductCommandHandlers,
		...MealCommandHandlers
	],
	controllers: [
		...StoreContollers
	]
})
export class StoreModule implements OnModuleInit {
	constructor(
		private readonly moduleRef: ModuleRef,
		private readonly command$: CommandBus,
		private readonly event$: EventBus,
	) {}

	onModuleInit() {
		this.command$.setModuleRef(this.moduleRef);
		this.event$.setModuleRef(this.moduleRef);

		this.command$.register(StoreCommandHandlers);
		this.command$.register(IngredientCommandHandlers);
		this.command$.register(StoreQueryHandlers);
		this.command$.register(ResourceQueryHandlers);
		this.command$.register(ProductCommandHandlers);
		this.command$.register(MealCommandHandlers);
	}
}
