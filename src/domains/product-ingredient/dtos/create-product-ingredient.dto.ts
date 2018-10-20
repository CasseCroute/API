import {IsNumber, IsUUID} from 'class-validator';

export class CreateProductIngredientDto {
	@IsUUID()
	readonly uuid: string;

	@IsNumber()
	readonly quantity: number;
}
