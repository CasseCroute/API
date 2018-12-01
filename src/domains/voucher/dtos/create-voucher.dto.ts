import {IsDateString, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';

export class CreateVoucherDto {
	@IsString()
	@MaxLength(32)
	readonly code: string;

	@IsNumber()
	readonly reduction: number;

	@IsDateString()
	readonly expirationDate: Date;

	@IsOptional()
	readonly description: string;
}
