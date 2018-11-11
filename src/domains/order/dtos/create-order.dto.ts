import {
	IsString,
	IsOptional,
	ValidateNested,
	IsBoolean,
} from 'class-validator';
import {Type} from 'class-transformer';
import {
	CreateOrderDetailMealDto,
	CreateOrderDetailProductDto
} from '@letseat/domains/order/dtos/create-order-detail.dto';

export class CreateOrderDto {
	@IsBoolean()
	readonly isGuest: boolean;

	@IsString()
	readonly deliveryAddress: string;

	@IsString()
	@IsOptional()
	readonly deliveryNote: string;

	@IsBoolean()
	@IsOptional()
	readonly isTakeAway: string;

	@IsBoolean()
	@IsOptional()
	readonly isEatIn: string;

	@IsBoolean()
	@IsOptional()
	readonly isDelivery: string;

	@ValidateNested()
	@Type(() => CreateOrderDetailProductDto || CreateOrderDetailMealDto)
	details: CreateOrderDetailProductDto[] | CreateOrderDetailMealDto[];
}
