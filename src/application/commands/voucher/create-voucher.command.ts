import {ICommand} from '@nestjs/cqrs';
import {CreateVoucherDto} from '@letseat/domains/voucher/dtos';

export class CreateVoucherCommand implements ICommand {
	readonly storeUuid: string;
	readonly voucher: CreateVoucherDto;

	constructor(storeUuid: string, voucher: CreateVoucherDto) {
		this.storeUuid = storeUuid;
		this.voucher = voucher;
	}
}
