import {IsString, IsUUID, IsNumber} from 'class-validator';

export class AddProductToCartDto {
	@IsUUID()
	readonly productUuid: string;

	@IsNumber()
	readonly quantity: number;

	@IsString()
	readonly instructions: string;
}
