import {IsNumber, IsUUID} from 'class-validator';

export class CreateProductIngredientDto {
	@IsUUID()
	readonly ingredientUuid: string;

	@IsNumber()
	readonly quantity: number;
}
