import {IsUUID} from 'class-validator';

export class UpdateOrderStatusDto {
	@IsUUID()
	readonly orderStatusUuid: string;
}
