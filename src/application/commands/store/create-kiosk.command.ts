import {ICommand} from '@nestjs/cqrs';
import {Kiosk} from '@letseat/domains/kiosk/kiosk.entity';

/**
 * Dispatch a new CreateKiosk command.
 */
export class CreateKioskCommand implements ICommand {
	private readonly uuid: string;
	private readonly kiosk: Kiosk;

	constructor(uuid: string, kioskSerialNumber: string) {
		this.uuid = uuid;
		this.kiosk = new Kiosk({serialNumber: kioskSerialNumber});
	}
}
