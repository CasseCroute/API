import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {Order} from '@letseat/domains/order/order.entity';
import {createOrderValidatorOptions} from '@letseat/domains/order/pipes';
import {CreateOrderDto} from '@letseat/domains/order/dtos';
import {CreateOrderCommand} from '@letseat/application/commands/order/create-order.command';

@Controller('/orders')
export class OrderController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Post()
	@HttpCode(200)
	@UseGuards(AuthGuard('jwt'))
	public async placeOrder(
		@Req() request: any,
		@Body(new ValidationPipe<Order>(createOrderValidatorOptions)) order: CreateOrderDto
	): Promise<any> {
		return request.user.entity === AuthEntities.Customer
			? this.commandBus.execute(new CreateOrderCommand(request.user.uuid, order))
			: (() => {
				throw new UnauthorizedException();
			})();
	}
}
