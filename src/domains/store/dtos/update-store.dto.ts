import {IsString, IsNumber, IsOptional, Min} from 'class-validator';

export class UpdateStoreDto {
	@IsString()
	readonly name: string;

	@IsNumber()
	@Min(10)
	readonly phoneNumber: number;

	@IsString()
	@IsOptional()
	readonly imageUrl?: string;
}
