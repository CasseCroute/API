import {ICommand} from '@nestjs/cqrs';

export class GetVoucherByCodeQuery implements ICommand {
	readonly storeUuid: string;
	readonly voucherCode: string;

	constructor(storeUuid: string, voucherCode: string) {
		this.storeUuid = storeUuid;
		this.voucherCode = voucherCode;
	}

}
