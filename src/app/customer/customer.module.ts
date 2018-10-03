import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Customer} from './';
import {CustomerService} from './customer.service';
import {CustomerController} from './customer.controller';
import {CustomerRepository} from './repository/customer.repository';
import {CommandBus, CQRSModule, EventBus} from '@nestjs/cqrs';
import {CustomerCommandHandlers} from './commands/handlers';
import {ModuleRef} from '@nestjs/core';
import {CustomerQueryHandlers} from './queries/handlers';
import {AuthCustomerService} from '../auth/services/auth.customer.service';
@Module({
	imports: [
		TypeOrmModule.forFeature([Customer, CustomerRepository]),
		CQRSModule
	],
	providers: [
		CustomerService,
		AuthCustomerService,
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
