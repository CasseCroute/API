import {IsNumber, IsNumberString, IsUUID} from 'class-validator';

export class UpdateMealSubsectionOptionIngredientDto {
	@IsUUID()
	readonly optionIngredientUuid: string;

	@IsNumberString()
	readonly price?: number;

	@IsNumber()
	readonly quantity?: number;
}
