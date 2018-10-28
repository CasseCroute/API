import {IsNumber, IsNumberString, IsUUID} from 'class-validator';

export class UpdateMealSubsectionOptionProductDto {
	@IsUUID()
	readonly optionProductUuid: string;

	@IsNumberString()
	readonly price?: number;

	@IsNumber()
	readonly quantity?: number;
}
