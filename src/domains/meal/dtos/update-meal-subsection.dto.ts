import {
	IsString,
	IsNumber,
	IsBoolean, ValidateNested
} from 'class-validator';
import {Type} from 'class-transformer';
import {UpdateMealSubsectionOptionDto} from '@letseat/domains/meal/dtos/update-meal-subsection-option.dto';

export class UpdateMealSubsectionDto {
	@IsString()
	readonly name?: string;

	@IsBoolean()
	readonly isRequired?: boolean;

	@IsBoolean()
	allowMultipleSelections?: boolean;

	@IsNumber()
	readonly minSelectionsPermitted?: number;

	@IsNumber()
	readonly maxSelectionsPermitted?: number;

	@ValidateNested()
	@Type(() => UpdateMealSubsectionOptionDto)
	options: UpdateMealSubsectionOptionDto;

}
