import {IsString, IsOptional, IsNumberString, MaxLength, IsNumber, IsUUID, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {CreateMealSubsectionDto} from '@letseat/domains/meal/dtos/create-meal-subsection.dto';

export class CreateMealDto {
	@IsString()
	@MaxLength(16)
	readonly reference: string;

	@IsString()
	readonly name: string;

	@IsString()
	@IsOptional()
	readonly description: string;

	@IsNumberString()
	readonly price: number;

	@IsNumber()
	@IsOptional()
	readonly productQuantity: number;

	@IsUUID()
	readonly productUuid: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => CreateMealSubsectionDto)
	subsections: CreateMealSubsectionDto[];
}
