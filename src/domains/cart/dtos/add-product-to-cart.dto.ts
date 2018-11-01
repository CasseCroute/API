import {IsString, IsUUID, IsNumber, IsOptional} from 'class-validator';

export class AddProductToCartDto {
	@IsUUID()
	readonly productUuid: string;

	@IsNumber()
	readonly quantity: number;

	@IsOptional()
	@IsString()
	readonly instructions: string;

	@IsOptional()
	@IsUUID(undefined, {each: true})
	optionUuids: string[];
}
