/* tslint:disable */
import {
	EntityRepository,
	ObjectLiteral,
	getRepository,
	Repository,
	Transaction,
	TransactionManager
} from 'typeorm';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {omitDeep} from '@letseat/shared/utils';
import {Address} from '@letseat/domains/address/address.entity';

@EntityRepository(Address)
export class AddressRepository extends Repository<Address> implements ResourceRepository {
	@Transaction()
	public async saveAddress(address: Address, @TransactionManager() addressRepository: Repository<Address>) {
		return addressRepository.save(address);
	}

	public async findOneByUuid(addressUuid: string) {
		const address = await this.findOne({where: {uuid: addressUuid}});
		return omitDeep('id', address);
	}

	public async updateAddress(address: any, values: ObjectLiteral) {
		return getRepository(Address).update(address!.id,{...values})
	}

}
