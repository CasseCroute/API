import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Param,
	Post,
	Req,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {CommandBus} from '@nestjs/cqrs';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {Voucher} from '@letseat/domains/voucher/voucher.entity';
import {voucherRegisterValidatorOptions} from '@letseat/domains/voucher/pipes';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {CreateVoucherCommand, DeleteVoucherByUuidCommand} from '@letseat/application/commands/voucher';
import {CreateVoucherDto} from '@letseat/domains/voucher/dtos';
import {isUuid} from '@letseat/shared/utils';

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

	@Delete(':voucherUuid')
	@UseGuards(AuthGuard('jwt'))
	public async deleteVoucher(@Req() request: any, @Param('voucherUuid') voucherUuid: string) {
		if (request.user.entity === AuthEntities.Store && isUuid(voucherUuid)) {
			return this.commandBus.execute(new DeleteVoucherByUuidCommand(request.user.uuid, voucherUuid));
		}
		if (!isUuid(voucherUuid)) {
			throw new BadRequestException();
		}
		throw new UnauthorizedException();

	}
}
