import {IsString, IsEmail, IsNumber} from 'class-validator';

export class CreatedStoreDto {
	@IsString()
	readonly uuid: string;

	@IsString()
	readonly name: string;

	@IsEmail()
	readonly email: string;

	@IsNumber()
	readonly phoneNumber: string;

	@IsString()
	readonly slug: string;

	@IsString()
	imgUrl?: string;
}
