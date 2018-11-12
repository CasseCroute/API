import {
	IsString,
	IsOptional,
	IsBoolean,
} from 'class-validator';

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
