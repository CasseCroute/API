import {
	IsString,
	IsNumber,
	IsBoolean, IsOptional, ValidateNested
} from 'class-validator';
import {Type} from 'class-transformer';
import {CreateMealSubsectionOptionDto} from '@letseat/domains/meal/dtos/create-meal-subsection-option.dto';

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
	@Type(() => CreateMealSubsectionOptionDto)
	options: CreateMealSubsectionOptionDto;

}
