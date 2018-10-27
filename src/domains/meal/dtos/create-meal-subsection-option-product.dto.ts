import {IsNumber, IsNumberString, IsOptional, IsUUID} from 'class-validator';

export class CreateMealSubsectionOptionProductDto {
	@IsUUID()
	readonly productUuid: string;

	@IsOptional()
	@IsNumberString()
	readonly price: number;

	@IsOptional()
	@IsNumber()
	readonly quantity: number;
}
