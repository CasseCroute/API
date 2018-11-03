import {EntityRepository, ObjectLiteral, Repository, Transaction, TransactionManager} from 'typeorm';
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
		return this.findOneOrFail({where: {uuid}});
	}

	public async updateCustomer(uuid: string, values: ObjectLiteral) {
		return this.update(values, {uuid});
	}

	public async deleteCustomerByUuid(uuid: string) {
		return this.delete({uuid});
	}

	public async getCart(uuid: string): Promise<Customer> {
		return this.findOneOrFail({relations: ['cart', 'cart.products', 'cart.meals', 'cart.store'], where: {uuid}});
	}
}
