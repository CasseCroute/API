import {IsString} from 'class-validator';

export class UpdateSectionNameDto {
	@IsString()
	readonly name: string;

}
