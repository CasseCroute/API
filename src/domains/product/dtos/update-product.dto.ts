import {IsString, IsNumberString, MaxLength} from 'class-validator';

export class UpdateProductDto {
	@IsString()
	@MaxLength(16)
	readonly reference?: string;

	@IsString()
	readonly name?: string;

	@IsString()
	@MaxLength(13)
	readonly ean13?: string;

	@IsString()
	readonly description?: string;

	@IsNumberString()
	readonly price?: number;
}
