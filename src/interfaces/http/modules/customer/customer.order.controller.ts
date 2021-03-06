import {
	BadRequestException,
	Body,
	Controller, Get, HttpCode, Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {GetCustomerOrdersQuery} from '@letseat/application/queries/customer';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {Order} from '@letseat/domains/order/order.entity';
import {createOrderValidatorOptions} from '@letseat/domains/order/pipes';
import {CreateOrderDto} from '@letseat/domains/order/dtos';
import {CreateGuestOrderDto} from '@letseat/domains/order/dtos/create-order.dto';
import {CreateGuestOrderCommand, CreateOrderCommand} from '@letseat/application/commands/order';
import {isUndefined} from '@letseat/shared/utils';
import {PaymentService} from '@letseat/infrastructure/services/payment.service';

@Controller('customers/me/orders')
export class CurrentCustomerOrderController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly paymentService: PaymentService
	) {
	}

	@Post()
	@HttpCode(200)
	@UseGuards(AuthGuard('jwt'))
	public async placeOrder(
		@Req() request: any,
		@Body(new ValidationPipe<Order>(createOrderValidatorOptions)) order: CreateOrderDto
	): Promise<any> {
		if (isUndefined(order.isDelivery) && isUndefined(order.isTakeAway)) {
			throw new BadRequestException();
		}
		if (request.user.entity !== AuthEntities.Customer) {
			(() => {
				throw new UnauthorizedException();
			})();
		} else {
			const stripeCustomer = await this.paymentService.createCustomer(order.paymentDetails, request.user.email);
			await this.paymentService.createCharge(stripeCustomer, order.totalToPay);
			return this.commandBus.execute(new CreateOrderCommand(request.user.uuid, order));
		}
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	public async getOrders(@Req() request: any): Promise<any> {
		return request.user.entity === AuthEntities.Customer
			? this.commandBus.execute(new GetCustomerOrdersQuery(request.user.uuid))
			: (() => {
				throw new UnauthorizedException();
			})();
	}
}

@Controller('customers/guest/orders')
export class GuestCustomerOrderController {
	constructor(private readonly commandBus: CommandBus, private readonly paymentService: PaymentService) {
	}

	@Post()
	public async placeOrder(
		@Body(new ValidationPipe<Order>(createOrderValidatorOptions)) guestOrder: CreateGuestOrderDto
	): Promise<any> {
		if (isUndefined(guestOrder.isEatIn) && isUndefined(guestOrder.isTakeAway)) {
			throw new BadRequestException();
		}
		const stripeCustomer = await this.paymentService.createCustomer(guestOrder.paymentDetails);
		await this.paymentService.createCharge(stripeCustomer, guestOrder.totalToPay);
		return this.commandBus.execute(new CreateGuestOrderCommand(guestOrder, guestOrder.storeUuid));
	}
}
