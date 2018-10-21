import {IsString, IsNumberString, MaxLength, IsOptional, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {UpdateProductIngredientDto} from '@letseat/domains/product-ingredient/dtos';

export class UpdateProductDto {
	@IsString()
	@MaxLength(16)
	readonly reference?: string;

	@IsString()
	readonly name?: string;

	@IsString()
	@MaxLength(13)
	readonly ean13?: string;

	@IsString()
	readonly description?: string;

	@IsNumberString()
	readonly price?: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => UpdateProductIngredientDto)
	ingredients: UpdateProductIngredientDto[];
}
