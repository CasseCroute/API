import {EntityRepository, Repository, Transaction, TransactionManager} from 'typeorm';
import {Customer} from '@customer';

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

	@Transaction()
	public async findOneByPassword(customer: Customer, @TransactionManager() customerRepository: Repository<Customer>) {
		return customerRepository.findOne(customer);
	}
}
