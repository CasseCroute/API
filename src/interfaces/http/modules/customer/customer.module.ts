import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CustomerController} from './customer.controller';
import {CommandBus, CQRSModule, EventBus} from '@nestjs/cqrs';
import {ModuleRef} from '@nestjs/core';
import {CustomerCommandHandlers} from '@letseat/application/commands/customer/handlers';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {CustomerQueryHandlers} from '@letseat/application/queries/customer/handlers';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([Customer, CustomerRepository]),
		CQRSModule
	],
	providers: [
		JwtStrategy,
		...CustomerCommandHandlers,
		...CustomerQueryHandlers
	],
	controllers: [CustomerController]
})
export class CustomerModule implements OnModuleInit {
	constructor(
		private readonly moduleRef: ModuleRef,
		private readonly command$: CommandBus,
		private readonly event$: EventBus,
	) {}

	onModuleInit() {
		this.command$.setModuleRef(this.moduleRef);
		this.event$.setModuleRef(this.moduleRef);

		this.command$.register(CustomerCommandHandlers);
		this.command$.register(CustomerQueryHandlers);
	}
}
