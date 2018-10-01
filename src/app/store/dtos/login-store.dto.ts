import {IsString, IsEmail} from 'class-validator';

export class LoginStoreDto {
	@IsEmail()
	readonly email: string;

	@IsString()
	readonly password: string;
}
