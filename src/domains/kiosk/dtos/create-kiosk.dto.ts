import {MinLength, MaxLength} from 'class-validator';

export class CreateKioskDto {
	@MinLength(27)
	@MaxLength(27)
	readonly serialNumber: string;
}
