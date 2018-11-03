import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CurrentCustomerController, CustomerController} from './customer.controller';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {ModuleRef} from '@nestjs/core';
import {CustomerCommandHandlers} from '@letseat/application/commands/customer/handlers';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {CustomerQueryHandlers} from '@letseat/application/queries/customer/handlers';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {CurrentCustomerCartController} from '@letseat/interfaces/http/modules/customer/customer.cart.controller';
import {CartCommandHandlers} from '@letseat/application/commands/cart/handlers';

@Module({
	imports: [
		TypeOrmModule.forFeature([Customer, CustomerRepository]),
		CQRSModule
	],
	providers: [
		JwtStrategy,
		...CartCommandHandlers,
		...CustomerCommandHandlers,
		...CustomerQueryHandlers
	],
	controllers: [
		CurrentCustomerController,
		CustomerController,
		CurrentCustomerCartController
	]
})
export class CustomerModule implements OnModuleInit {
	constructor(
		private readonly moduleRef: ModuleRef,
		private readonly command$: CommandBus,
	) {}

	onModuleInit() {
		this.command$.setModuleRef(this.moduleRef);

		this.command$.register(CustomerCommandHandlers);
		this.command$.register(CustomerQueryHandlers);
		this.command$.register(CartCommandHandlers);
	}
}
