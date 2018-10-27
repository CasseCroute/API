import {IsNumber, IsNumberString, IsOptional, IsUUID} from 'class-validator';

export class CreateMealSubsectionOptionIngredientDto {
	@IsUUID()
	readonly ingredientUuid: string;

	@IsOptional()
	@IsNumberString()
	readonly price: number;

	@IsOptional()
	@IsNumber()
	readonly quantity: number;
}
