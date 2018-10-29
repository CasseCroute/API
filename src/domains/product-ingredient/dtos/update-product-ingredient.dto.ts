import {IsNumber, IsUUID} from 'class-validator';

export class UpdateProductIngredientDto {
	@IsUUID()
	readonly ingredientUUid: string;

	@IsNumber()
	readonly quantity?: number;
}
