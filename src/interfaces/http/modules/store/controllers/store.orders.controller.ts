import {
	BadRequestException,
	Body,
	Controller, Get, HttpCode, Param, Patch, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {GetStoreOrdersQuery} from '@letseat/application/queries/store';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {isUuid} from '@letseat/shared/utils';
import {
	UpdateOrderStatusCommand,
} from '@letseat/application/commands/order';
import {UpdateOrderStatusDto} from '@letseat/domains/order/dtos/update-order-status.dto';
import {updateOrderValidatorOptions} from '@letseat/domains/order/pipes';

@Controller('stores/me/orders')
export class CurrentStoreOrdersController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	public async getOrders(@Req() request: any): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new GetStoreOrdersQuery(request.user.uuid))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Patch(':uuid')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public async updateOrderStatus(
		@Req() request: any,
		@Body(new ValidationPipe<any>(updateOrderValidatorOptions)) order: UpdateOrderStatusDto,
		@Param('uuid') orderUuid: string): Promise<any> {
		if (!isUuid(orderUuid)) {
			throw new BadRequestException();
		}
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new UpdateOrderStatusCommand(request.user.uuid, orderUuid, order))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

}
