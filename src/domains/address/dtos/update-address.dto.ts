import {MaxLength, IsString, IsOptional, Length, IsNumberString} from 'class-validator';

export class UpdateAddressDto {
	@IsString()
	@MaxLength(256)
	readonly street?: string;

	@IsString()
	@IsOptional()
	@MaxLength(128)
	readonly company?: string;

	@IsString()
	@MaxLength(128)
	readonly city?: string;

	@IsNumberString()
	@Length(5, 10)
	readonly zipCode?: string;

	@IsString()
	readonly country?: string;
}
