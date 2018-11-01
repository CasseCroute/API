import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {AddProductToCartCommand} from '@letseat/application/commands/cart';
import {CustomerRepository} from '@letseat/infrastructure/repository/customer.repository';
import {defer} from 'rxjs';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {CartRepository} from '@letseat/infrastructure/repository/cart.repository';

@CommandHandler(AddProductToCartCommand)
export class AddProductToCartHandler implements ICommandHandler<AddProductToCartCommand> {
	async execute(command: AddProductToCartCommand, resolve: (value?) => void) {
		const customerRepository = getCustomRepository(CustomerRepository);
		const cartRepository = getCustomRepository(CartRepository);

		defer(async () => {
			return customerRepository.getCart(command.uuid);
		}).subscribe({
			next: async (customer: Customer) => {
				return !customer.cart
					? defer(async () => {
						const cart = await cartRepository.createCart(customer, command.product.productUuid);
						return cartRepository.addProductToCart(cart, command.product);
					}).subscribe(cart => resolve(cart))
					: defer(async () => {
						return cartRepository.addProductToCart(customer.cart, command.product, customer);
					}).subscribe(cart => resolve(cart));
			}
		});
	}
}
