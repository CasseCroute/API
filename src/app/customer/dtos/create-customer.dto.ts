import {IsString, IsEmail, IsNumber, Min} from 'class-validator';

export class CreateCustomerDto {
	@IsString()
	readonly firstName: string;

	@IsString()
	readonly lastName: string;

	@IsEmail()
	readonly email: string;

	@IsNumber()
	@Min(10)
	readonly phoneNumber: number;

	@IsString()
	readonly password: string;
}
