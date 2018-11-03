import {IsUUID, IsOptional} from 'class-validator';

export class RemoveProductOrMealToCartDto {
	@IsOptional()
	@IsUUID()
	readonly productUuid: string;

	@IsOptional()
	@IsUUID()
	readonly mealUuid: string;
}
