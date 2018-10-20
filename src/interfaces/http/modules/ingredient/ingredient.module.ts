import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CommandBus, CQRSModule, EventBus} from '@nestjs/cqrs';
import {ModuleRef} from '@nestjs/core';
import {IngredientRepository} from '@letseat/infrastructure/repository/ingredient.repository';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {ResourceQueryHandlers} from '@letseat/application/queries/resource/handlers';
import {IngredientCommandHandlers} from '@letseat/application/commands/ingredient/handlers';
import {IngredientController} from '@letseat/interfaces/http/modules/ingredient/controllers/ingredient.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Ingredient, IngredientRepository]),
		CQRSModule
	],
	providers: [
		JwtStrategy,
		...ResourceQueryHandlers,
		...IngredientCommandHandlers
	],
	controllers: [
		IngredientController
	]
})
export class IngredientModule implements OnModuleInit {
	constructor(
		private readonly moduleRef: ModuleRef,
		private readonly command$: CommandBus,
		private readonly event$: EventBus,
	) {}

	onModuleInit() {
		this.command$.setModuleRef(this.moduleRef);
		this.event$.setModuleRef(this.moduleRef);

		this.command$.register(IngredientCommandHandlers);
		this.command$.register(ResourceQueryHandlers);
	}
}
