import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {ModuleRef} from '@nestjs/core';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {OrderRepository} from '@letseat/infrastructure/repository/order.repository';
import {Order} from '@letseat/domains/order/order.entity';
import {OrderController} from '@letseat/interfaces/http/modules/order/controllers/order.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Order, OrderRepository]),
		CQRSModule
	],
	providers: [
		JwtStrategy
	],
	controllers: [
		OrderController
	]
})
export class OrderModule implements OnModuleInit {
	constructor(
		private readonly moduleRef: ModuleRef,
		private readonly command$: CommandBus,
	) {}

	onModuleInit() {
		this.command$.setModuleRef(this.moduleRef);
	}
}
