import {
	BadRequestException,
	Body,
	Controller,
	Delete, Get, HttpCode,
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
import {GetVoucherByCodeQuery, GetVoucherByUuidQuery, GetVouchersQuery} from '@letseat/application/queries/voucher';

@Controller('/stores/me/vouchers')
export class StoreVouchersController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	public async getVouchers(@Req() request: any) {
		if (request.user.entity === AuthEntities.Store) {
			return this.commandBus.execute(new GetVouchersQuery(request.user.uuid));
		}
		throw new UnauthorizedException();
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
	@HttpCode(204)
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

	@Get(':voucherUuid')
	@UseGuards(AuthGuard('jwt'))
	public async getVoucherByUuid(@Req() request: any, @Param('voucherUuid') voucherUuid: string) {
		if (request.user.entity === AuthEntities.Store && isUuid(voucherUuid)) {
			return this.commandBus.execute(new GetVoucherByUuidQuery(request.user.uuid, voucherUuid));
		}
		if (!isUuid(voucherUuid)) {
			throw new BadRequestException();
		}
		throw new UnauthorizedException();
	}

	@Get('/code/:voucherCode')
	@UseGuards(AuthGuard('jwt'))
	public async getVoucherByCode(@Req() request: any, @Param('voucherCode') voucherCode: string) {
		if (request.user.entity === AuthEntities.Store || request.user.entity === AuthEntities.Customer) {
			return this.commandBus.execute(new GetVoucherByCodeQuery(request.user.uuid, voucherCode));
		}
		throw new UnauthorizedException();
	}
}
