import {IsString, IsNumber} from 'class-validator';

export class UpdateIngredientDto {
	@IsString()
	readonly name?: string;

	@IsNumber()
	readonly quantity?: number;
}
