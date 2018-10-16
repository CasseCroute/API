import {Body, Controller, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {Kiosk} from '@letseat/domains/kiosk/kiosk.entity';
import {createKioskValidatorOptions} from '@letseat/domains/kiosk/pipes';
import {CreateKioskDto} from '@letseat/domains/kiosk/dtos';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {CreateKioskCommand} from '@letseat/application/commands/store';
import {CommandBus} from '@nestjs/cqrs';

@Controller('stores/me/kiosks')
export class StoreKiosksController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public async createKiosk(
		@Req() request: any,
		@Body(new ValidationPipe<Kiosk>(createKioskValidatorOptions)) kiosk: CreateKioskDto): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new CreateKioskCommand(request.user.uuid, kiosk.serialNumber))
			: (() => {
				throw new UnauthorizedException();
			})();
	}
}
