import {IsString, IsOptional, IsNumberString, MaxLength, IsNumber, IsUUID} from 'class-validator';

export class CreateMealDto {
	@IsString()
	@MaxLength(16)
	readonly reference: string;

	@IsString()
	readonly name: string;

	@IsString()
	@IsOptional()
	readonly description: string;

	@IsNumberString()
	readonly price: number;

	@IsNumber()
	@IsOptional()
	readonly productQuantity: number;

	@IsUUID()
	readonly productUuid: string;
}
