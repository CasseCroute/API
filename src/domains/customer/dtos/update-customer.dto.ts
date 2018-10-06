import {IsDate, IsEmail, IsNumber, IsString, Min} from 'class-validator';

export class UpdateCustomerDto {
	@IsString()
	readonly firstName?: string;

	@IsString()
	readonly lastName?: string;

	@IsEmail()
	readonly email?: string;

	@IsNumber()
	@Min(10)
	readonly phoneNumber: number;

	@IsDate()
	readonly birthDate: Date;
}
