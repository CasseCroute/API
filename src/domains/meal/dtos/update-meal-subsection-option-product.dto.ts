import {IsNumber, IsNumberString, IsUUID} from 'class-validator';

export class UpdateMealSubsectionOptionProductDto {
	@IsUUID()
	readonly productUuid?: string;

	@IsNumberString()
	readonly price?: number;

	@IsNumber()
	readonly quantity?: number;
}
