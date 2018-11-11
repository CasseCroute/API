import {
	IsNumber, IsOptional, IsNumberString, IsString, IsUUID
} from 'class-validator';

export class CreateOrderDetailProductDto {
	@IsNumber()
	readonly quantity: string;

	@IsNumberString()
	readonly price: number;

	@IsOptional()
	@IsString()
	readonly instructions: number;

	@IsUUID()
	readonly productUuid: string;
}

export class CreateOrderDetailMealDto {
	@IsNumber()
	readonly quantity: string;

	@IsNumberString()
	readonly price: number;

	@IsOptional()
	@IsString()
	readonly instructions: number;

	@IsUUID()
	readonly mealUuid: string;

	@IsUUID(undefined, {each: true})
	optionUuids: string[];
}
