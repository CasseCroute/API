import {IsString, IsOptional, ValidateNested, IsNumberString} from 'class-validator';
import {Type} from 'class-transformer';
import {CreateProductIngredientDto} from '@letseat/domains/product-ingredient/dtos';

export class CreateProductDto {
	@IsString()
	readonly reference: string;

	@IsString()
	readonly name: string;

	@IsString()
	@IsOptional()
	readonly ean13: string;

	@IsString()
	@IsOptional()
	readonly description: string;

	@IsNumberString()
	readonly price: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => CreateProductIngredientDto)
	ingredients: CreateProductIngredientDto[];
}
