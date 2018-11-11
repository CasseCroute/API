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
	readonly isTakeAway: string;

	@IsBoolean()
	@IsOptional()
	readonly isEatIn: string;

	@IsBoolean()
	@IsOptional()
	readonly isDelivery: string;
}
