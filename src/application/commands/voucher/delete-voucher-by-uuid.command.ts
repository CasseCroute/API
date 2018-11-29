import {ICommand} from '@nestjs/cqrs';

export class DeleteVoucherByUuidCommand implements ICommand {
	readonly storeUuid: string;
	readonly voucherUuid: string;

	constructor(storeUuid: string, voucherUuid: string) {
		this.storeUuid = storeUuid;
		this.voucherUuid = voucherUuid;
	}
}
