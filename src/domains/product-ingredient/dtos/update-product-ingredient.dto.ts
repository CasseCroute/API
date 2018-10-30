import {IsNumber, IsUUID} from 'class-validator';

export class UpdateProductIngredientDto {
	@IsUUID()
	readonly ingredientUuid: string;

	@IsNumber()
	readonly quantity?: number;
}
