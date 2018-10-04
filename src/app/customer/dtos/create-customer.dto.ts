import {IsString, IsEmail, IsNumber, IsOptional, Min} from 'class-validator';

export class CreateCustomerDto {
	@IsString()
	readonly name: string;

	@IsEmail()
	readonly email: string;

	@IsNumber()
	@Min(10)
	readonly phoneNumber: number;

	@IsString()
	readonly password: string;

	@IsString()
	@IsOptional()
	readonly imageUrl?: string;
}
