import {EntityRepository, getConnection, ObjectLiteral, Repository, Transaction, TransactionManager} from 'typeorm';
import {Customer} from '@letseat/domains/customer/customer.entity';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
	@Transaction()
	public async saveCustomer(customer: Customer, @TransactionManager() customerRepository: Repository<Customer>) {
		return customerRepository.save(customer);
	}

	public async findOneByEmail(customerEmail: string) {
		return this.findOne({where: {email: customerEmail}});
	}

	public async getPassword(customer: Customer) {
		return this.findOne({select: ['password'], where: {id: customer.id}});
	}

	public async findOneByUuid(uuid: string) {
		const customer = await this.findOne({where: {uuid}});
		delete customer!.id;
		return customer;
	}

	public async updateCustomer(uuid: string, values: ObjectLiteral) {
		return getConnection()
			.createQueryBuilder()
			.update(Customer)
			.set(values)
			.where('uuid = :uuid', {uuid})
			.execute();
	}

	@Transaction()
	public async findOneByPassword(customer: Customer, @TransactionManager() customerRepository: Repository<Customer>) {
		return customerRepository.findOne(customer);
	}

	public static async deleteCustomerByUuid(uuid: string) {
		return getConnection()
			.createQueryBuilder()
			.delete()
			.from(Customer)
			.where('uuid = :uuid', {uuid})
			.execute();
	}
}
