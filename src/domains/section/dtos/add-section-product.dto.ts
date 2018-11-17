import {IsOptional, IsUUID} from 'class-validator';

export class AddSectionProductDto {
	@IsUUID()
	sectionUuid: string;

	@IsOptional()
	@IsUUID(undefined, {each: true})
	products: string[];

	@IsOptional()
	@IsUUID(undefined, {each: true})
	meals: string[];
}
