import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {RemoveProductOrMealToCartCommand} from '@letseat/application/commands/cart';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {defer} from 'rxjs';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {CartRepository} from '@letseat/infrastructure/repository/cart.repository';

@CommandHandler(RemoveProductOrMealToCartCommand)
export class RemoveProductOrMealToCartHandler implements ICommandHandler<RemoveProductOrMealToCartCommand> {
	async execute(command: RemoveProductOrMealToCartCommand, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		const cartRepository = getCustomRepository(CartRepository);

		defer(async () => {
			return customerRepository.getCart(command.customerUuid);
		}).subscribe({
			next: async (customer: Customer) => {
				return defer(async () => {
					return cartRepository.removeProductToCart(customer.cart, command.product);
				}).subscribe({
					next: cart => resolve(cart),
					error: error => resolve(Promise.reject(error))
				});
			}
		});
	}
}
