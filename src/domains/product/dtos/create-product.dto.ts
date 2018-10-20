import {IsString, IsOptional, IsNumber, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {CreateAddressDto} from '@letseat/domains/address/dtos';
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

	@IsNumber()
	readonly price: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => CreateProductIngredientDto)
	ingredients: CreateProductIngredientDto
}
