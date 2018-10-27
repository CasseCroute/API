import {IsString, IsEmail, MinLength, IsNumberString} from 'class-validator';

export class CreateCustomerDto {
	@IsString()
	readonly firstName: string;

	@IsString()
	readonly lastName: string;

	@IsEmail()
	readonly email: string;

	@IsNumberString()
	@MinLength(10)
	readonly phoneNumber: string;

	@IsString()
	readonly password: string;
}
