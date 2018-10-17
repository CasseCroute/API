import {IsString, IsNumber} from 'class-validator';

export class CreateIngredientDto {
	@IsString()
	readonly name: string;

	@IsNumber()
	readonly quantity: number;
}
