import {IsString, IsEmail} from 'class-validator';

export class LoginCustomerDto {
	@IsEmail()
	readonly email: string;

	@IsString()
	readonly password: string;
}
