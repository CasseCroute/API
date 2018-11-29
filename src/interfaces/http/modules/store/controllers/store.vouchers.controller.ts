import {Body, Controller, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {CommandBus} from '@nestjs/cqrs';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {Voucher} from '@letseat/domains/voucher/voucher.entity';
import {voucherRegisterValidatorOptions} from '@letseat/domains/voucher/pipes';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {CreateVoucherCommand} from '@letseat/application/commands/voucher';
import {CreateVoucherDto} from '@letseat/domains/voucher/dtos';

@Controller('/stores/me/vouchers')
export class StoreVouchersController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public async createVoucher(@Req() request: any, @Body(new ValidationPipe<Voucher>(voucherRegisterValidatorOptions)) voucher: CreateVoucherDto): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new CreateVoucherCommand(request.user.uuid, voucher))
			: (() => {
				throw new UnauthorizedException();
			})();

	}
}
