import {IsOptional, IsString, IsUUID} from 'class-validator';

export class CreateSectionDto {
	@IsString()
	readonly name: string;

	@IsOptional()
	@IsUUID(undefined, {each: true})
	products: string[];

	@IsOptional()
	@IsUUID(undefined, {each: true})
	meals: string[];
}
