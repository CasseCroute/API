import {ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {UpdateMealSubsectionOptionIngredientDto} from '@letseat/domains/meal/dtos/update-meal-subsection-option-ingredient.dto';
import {UpdateMealSubsectionOptionProductDto} from '@letseat/domains/meal/dtos/update-meal-subsection-option-product.dto';

export class UpdateMealSubsectionOptionDto {
	@ValidateNested()
	@Type(() => UpdateMealSubsectionOptionIngredientDto)
	ingredients?: UpdateMealSubsectionOptionIngredientDto[];

	@ValidateNested()
	@Type(() => UpdateMealSubsectionOptionProductDto)
	products?: UpdateMealSubsectionOptionProductDto[];

}
