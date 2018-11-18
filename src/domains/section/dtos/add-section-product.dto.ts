import {IsOptional, IsUUID} from 'class-validator';

export class AddSectionProductDto {
	@IsOptional()
	@IsUUID(undefined, {each: true})
	products: string[];

	@IsOptional()
	@IsUUID(undefined, {each: true})
	meals: string[];
}
