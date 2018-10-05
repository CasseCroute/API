import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {StoreController} from './store.controller';
import {CommandBus, CQRSModule, EventBus} from '@nestjs/cqrs';
import {ModuleRef} from '@nestjs/core';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';
import {StoreCommandHandlers} from '@letseat/application/commands/store/handlers';
import {StoreQueryHandlers} from '@letseat/application/queries/store/handlers';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {ResourceQueryHandlers} from '@letseat/application/queries/resource/handlers';

@Module({
	imports: [
		TypeOrmModule.forFeature([Store, StoreRepository]),
		CQRSModule
	],
	providers: [
		JwtStrategy,
		...ResourceQueryHandlers,
		...StoreCommandHandlers,
		...StoreQueryHandlers
	],
	controllers: [StoreController]
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
		this.command$.register(StoreQueryHandlers);
		this.command$.register(ResourceQueryHandlers);
	}
}
