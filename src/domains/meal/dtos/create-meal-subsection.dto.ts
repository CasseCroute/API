import {
	IsString,
	IsNumber,
	IsBoolean, IsOptional, ValidateNested
} from 'class-validator';
import {Type} from 'class-transformer';
import {CreateMealSubsectionOptionIngredientDto} from './create-meal-subsection-option-ingredient.dto';
import {CreateMealSubsectionOptionProductDto} from './create-meal-subsection-option-product.dto';

export class CreateMealSubsectionDto {
	@IsString()
	readonly name: string;

	@IsBoolean()
	readonly isRequired: boolean;

	@IsOptional()
	@IsBoolean()
	allowMultipleSelections: boolean;

	@IsNumber()
	readonly minSelectionsPermitted: number;

	@IsNumber()
	readonly maxSelectionsPermitted: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => CreateMealSubsectionOptionIngredientDto)
	ingredients: CreateMealSubsectionOptionIngredientDto[];

	@IsOptional()
	@ValidateNested()
	@Type(() => CreateMealSubsectionOptionProductDto)
	products: CreateMealSubsectionOptionProductDto[];
}
