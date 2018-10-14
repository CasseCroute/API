import {IsString, IsOptional, IsEmail, ValidateNested, IsNumberString, MinLength} from 'class-validator';
import {Type} from 'class-transformer';
import {UpdateAddressDto} from '@letseat/domains/address/dtos';

export class UpdateStoreDto {
	@IsString()
	readonly name?: string;

	@IsNumberString()
	@MinLength(10)
	readonly phoneNumber?: string;

	@IsEmail()
	readonly email?: string;

	@IsString()
	@IsOptional()
	readonly imageUrl?: string;

	@ValidateNested()
	@Type(() => UpdateAddressDto)
	address?: UpdateAddressDto;
}
