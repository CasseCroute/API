import {IsString, IsUUID, IsNumber, IsOptional} from 'class-validator';

export class AddProductOrMealToCartDto {
	@IsOptional()
	@IsUUID()
	readonly productUuid: string;

	@IsOptional()
	@IsUUID()
	readonly mealUuid: string;

	@IsNumber()
	readonly quantity: number;

	@IsOptional()
	@IsString()
	readonly instructions: string;

	@IsOptional()
	@IsUUID(undefined, {each: true})
	optionUuids: string[];
}
