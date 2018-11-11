import {
	EntityRepository,
	getCustomRepository,
	ObjectLiteral,
	Repository,
	Transaction,
	TransactionManager
} from 'typeorm';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {CartRepository} from '@letseat/infrastructure/repository/cart.repository';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
	private readonly cartRelations: string[] = [
		'products',
		'products.product',
		'meals',
		'meals.meal',
		'meals.ingredientOptions',
		'meals.productOptions',
		'store'
	];

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
		let customer;
		customer = await this.getCart(uuid);
		if (customer.cart) {
			customer = await this.findOne({relations: ['cart'], where: {uuid}});
			customer!.cart = await getCustomRepository(CartRepository)
				.findOneByUuid(customer!.cart.uuid, this.cartRelations);
			return customer;
		}
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
