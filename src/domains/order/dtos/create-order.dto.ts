import {
	IsString,
	IsOptional,
	IsBoolean, ValidateNested, IsArray, IsUUID,
} from 'class-validator';
import {Type} from 'class-transformer';
import {AddProductOrMealToCartDto} from '@letseat/domains/cart/dtos';

export class CreateOrderDto {
	@IsBoolean()
	readonly isGuest: boolean;

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
	readonly isEatIn: boolean;

	@IsBoolean()
	@IsOptional()
	readonly isDelivery: boolean;
}

export class CreateGuestOrderDto {
	@ValidateNested()
	@IsArray()
	@Type(() => AddProductOrMealToCartDto)
	order: AddProductOrMealToCartDto[];

	@IsUUID()
	storeUuid: string;
}
