import {
	IsString,
	IsEmail,
	ValidateNested,
	IsNumberString,
	MinLength,
	IsUUID,
	IsArray,
	ArrayMaxSize
} from 'class-validator';
import {CreateAddressDto} from '@letseat/domains/address/dtos';
import {Type} from 'class-transformer';

export class CreateStoreDto {
	@IsString()
	readonly name: string;

	@IsEmail()
	readonly email: string;

	@IsNumberString()
	@MinLength(10)
	readonly phoneNumber: string;

	@IsString()
	readonly password: string;

	@IsArray()
	@ArrayMaxSize(6)
	@IsUUID(undefined, {each: true})
	readonly cuisineUuids: string[];

	@ValidateNested()
	@Type(() => CreateAddressDto)
	address: CreateAddressDto;
}
