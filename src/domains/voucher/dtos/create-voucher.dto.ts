import {IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateVoucherDto {
	@IsString()
	readonly code: string;

	@IsNumber()
	readonly reduction: number;

	@IsString()
	readonly expirationDate: string;

	@IsOptional()
	readonly description: string;

}
