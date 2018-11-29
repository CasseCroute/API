import {ICommand} from '@nestjs/cqrs';

export class GetVouchersQuery implements ICommand {
	readonly storeUuid: string;

	constructor(storeUuid: string) {
		this.storeUuid = storeUuid;
	}
}
