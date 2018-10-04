import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Store} from './';
import {StoreService} from './store.service';
import {StoreController} from './store.controller';
import {StoreRepository} from './repository/store.repository';
import {CommandBus, CQRSModule, EventBus} from '@nestjs/cqrs';
import {StoreCommandHandlers} from './commands/handlers';
import {ModuleRef} from '@nestjs/core';
import {StoreQueryHandlers} from './queries/handlers';

@Module({
	imports: [
		TypeOrmModule.forFeature([Store, StoreRepository]),
		CQRSModule
	],
	providers: [
		StoreService,
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
	}
}
