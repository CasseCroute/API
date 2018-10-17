import {MinLength, MaxLength, Min} from 'class-validator';

export class CreateIngredientDto {
	@MinLength(2)
	@MaxLength(27)
	readonly name: string;

	@Min(0)
	readonly quantity: number;
}
