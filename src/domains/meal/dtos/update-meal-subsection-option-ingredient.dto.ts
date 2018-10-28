import {IsNumber, IsNumberString, IsUUID} from 'class-validator';

export class UpdateMealSubsectionOptionIngredientDto {
	@IsUUID()
	readonly ingredientUuid?: string;

	@IsNumberString()
	readonly price?: number;

	@IsNumber()
	readonly quantity?: number;
}
