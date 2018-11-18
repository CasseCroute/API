import {
	IsString,
	IsOptional,
	IsBoolean, ValidateNested, IsArray, IsUUID, IsNumber,
} from 'class-validator';
import {Type} from 'class-transformer';
import {AddProductOrMealToCartDto} from '@letseat/domains/cart/dtos';

export class CreateOrderDto {
	@IsNumber()
	readonly totalToPay: number;

	@IsOptional()
	@IsString()
	readonly deliveryAddress: string;

	@IsString()
	@IsOptional()
	readonly deliveryNote: string;

	@IsBoolean()
	@IsOptional()
	readonly isTakeAway: boolean;

	@IsBoolean()
	@IsOptional()
	readonly isDelivery: boolean;

	readonly payment: any;
}

export class CreateGuestOrderDto {
	@ValidateNested()
	@IsArray()
	@Type(() => AddProductOrMealToCartDto)
	cart: AddProductOrMealToCartDto[];

	@IsBoolean()
	@IsOptional()
	readonly isTakeAway: boolean;

	@IsBoolean()
	@IsOptional()
	readonly isEatIn: boolean;

	@IsUUID()
	storeUuid: string;
}
