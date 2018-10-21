import {IsNumber, IsUUID} from 'class-validator';

export class UpdateProductIngredientDto {
	@IsUUID()
	readonly uuid?: string;

	@IsNumber()
	readonly quantity?: number;
}
