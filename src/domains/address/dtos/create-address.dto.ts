
import {Column} from 'typeorm';

export class CreateAddressDto {
	@Column()
	street: string;

	@Column({name: 'zip_code'})
	zipCode: string;

	@Column()
	city: string;
}
