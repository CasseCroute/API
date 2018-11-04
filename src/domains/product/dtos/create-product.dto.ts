import {IsString, IsOptional, ValidateNested, IsNumberString, MaxLength, IsUUID} from 'class-validator';
import {Type} from 'class-transformer';
import {CreateProductIngredientDto} from '@letseat/domains/product-ingredient/dtos';

export class CreateProductDto {
	@IsString()
	@MaxLength(16)
	readonly reference: string;

	@IsString()
	readonly name: string;

	@IsString()
	@IsOptional()
	@MaxLength(13)
	readonly ean13: string;

	@IsString()
	@IsOptional()
	readonly description: string;

	@IsNumberString()
	readonly price: number;

	@IsOptional()
	@IsUUID()
	readonly cuisineUuid: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => CreateProductIngredientDto)
	ingredients: CreateProductIngredientDto[];
}
