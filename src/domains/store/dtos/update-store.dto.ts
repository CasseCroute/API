import {IsString, IsNumber, IsOptional, Min, IsEmail} from 'class-validator';

export class UpdateStoreDto {
	@IsString()
	readonly name?: string;

	@IsNumber()
	@Min(10)
	readonly phoneNumber: number;

	@IsEmail()
	readonly email?: string;

	@IsString()
	@IsOptional()
	readonly imageUrl?: string;
}
