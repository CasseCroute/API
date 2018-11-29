import {ICommand} from '@nestjs/cqrs';

export class GetVoucherByUuidQuery implements ICommand {
	readonly storeUuid: string;
	readonly voucherUuid: string;

	constructor(storeUuid: string, voucherUuid: string) {
		this.storeUuid = storeUuid;
		this.voucherUuid = voucherUuid;
	}

}
