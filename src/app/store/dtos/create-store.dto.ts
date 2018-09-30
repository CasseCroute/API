import {IsString, IsEmail, IsNumber, IsOptional, MinLength} from 'class-validator';

export class CreateStoreDto {
	@IsString()
	readonly name: string;

	@IsEmail()
	readonly email: string;

	@IsNumber()
	@MinLength(10, {
		message: 'Phone number is too short. Minimal length is $constraint1 characters'
	})
	readonly phoneNumber: number;

	@IsString()
	readonly password: string;

	@IsString()
	readonly slug: string;

	@IsString()
	@IsOptional()
	readonly imgUrl?: string;
}
