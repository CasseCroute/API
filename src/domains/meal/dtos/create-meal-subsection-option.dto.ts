import {IsOptional, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {CreateMealSubsectionOptionProductDto} from '@letseat/domains/meal/dtos/create-meal-subsection-option-product.dto';
import {CreateMealSubsectionOptionIngredientDto} from '@letseat/domains/meal/dtos/create-meal-subsection-option-ingredient.dto';

export class CreateMealSubsectionOptionDto {
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateMealSubsectionOptionIngredientDto)
	ingredients: CreateMealSubsectionOptionIngredientDto[];

	@IsOptional()
	@ValidateNested()
	@Type(() => CreateMealSubsectionOptionProductDto)
	products: CreateMealSubsectionOptionProductDto[];

}
