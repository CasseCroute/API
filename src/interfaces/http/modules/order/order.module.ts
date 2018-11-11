import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {ModuleRef} from '@nestjs/core';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {OrderRepository} from '@letseat/infrastructure/repository/order.repository';
import {Order, OrderDetailMeal, OrderDetailProduct} from '@letseat/domains/order/order.entity';
import {OrderController} from '@letseat/interfaces/http/modules/order/controllers/order.controller';
import {OrderCommandHandlers} from '@letseat/application/commands/order/handlers';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {CartRepository} from '@letseat/infrastructure/repository/cart.repository';
import {
	OrderDetailMealRepository,
	OrderDetailProductRepository
} from '@letseat/infrastructure/repository/order-detail.repository';
import {Cart} from '@letseat/domains/cart/cart.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Order,
			OrderRepository,
			CustomerRepository,
			Cart,
			CartRepository,
			OrderDetailProduct,
			OrderDetailProductRepository,
			OrderDetailMeal,
			OrderDetailMealRepository
		]),
		CQRSModule
	],
	providers: [
		JwtStrategy,
		...OrderCommandHandlers
	],
	controllers: [
		OrderController
	]
})
export class OrderModule implements OnModuleInit {
	constructor(
		private readonly moduleRef: ModuleRef,
		private readonly command$: CommandBus,
	) {
	}

	onModuleInit() {
		this.command$.setModuleRef(this.moduleRef);

		this.command$.register(OrderCommandHandlers);
	}
}
