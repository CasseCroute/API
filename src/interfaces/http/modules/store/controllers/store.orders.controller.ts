import {
	Controller, Get, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {GetStoreOrdersQuery} from '@letseat/application/queries/store';

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

}
