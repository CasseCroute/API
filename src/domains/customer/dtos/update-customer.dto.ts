import {IsEmail, IsNumberString, IsString, MinLength} from 'class-validator';

export class UpdateCustomerDto {
	@IsString()
	readonly firstName?: string;

	@IsString()
	readonly lastName?: string;

	@IsEmail()
	readonly email?: string;

	@IsNumberString()
	@MinLength(10)
	readonly phoneNumber: number;
}
