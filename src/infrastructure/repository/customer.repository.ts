import {EntityRepository, Repository, Transaction, TransactionManager} from 'typeorm';
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

	@Transaction()
	public async findOneByPassword(customer: Customer, @TransactionManager() customerRepository: Repository<Customer>) {
		return customerRepository.findOne(customer);
	}
}
