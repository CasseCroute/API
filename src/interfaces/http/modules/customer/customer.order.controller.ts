import {
	Controller, Get, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {GetCustomerOrdersQuery} from '@letseat/application/queries/customer';

@Controller('customers/me/orders')
export class CurrentCustomerOrderController {
	constructor(private readonly commandBus: CommandBus) {
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
