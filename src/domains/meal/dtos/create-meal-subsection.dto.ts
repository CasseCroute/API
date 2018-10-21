import {
	IsString,
	IsNumber,
	IsBoolean, IsOptional
} from 'class-validator';

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
}
