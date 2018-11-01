import {EntityRepository, getManager, getRepository, Repository} from 'typeorm';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {Cart, CartProduct} from '@letseat/domains/cart/cart.entity';
import {AddProductToCartDto} from '@letseat/domains/cart/dtos/add-product-to-cart.dto';
import {Product} from '@letseat/domains/product/product.entity';
import {omitDeep} from '@letseat/shared/utils';
import {LoggerService} from '@letseat/infrastructure/services';

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {
	public async findOneByUuid(uuid: string, relations?: string[], selectId = false) {
		const cart = await this.findOneOrFail({where: {uuid}, relations});
		return selectId ? cart : omitDeep('id', cart);
	}

	public async createCart(customer: Customer, productUuid: string): Promise<any> {
		const cart = new Cart();
		const product = await getManager()
			.findOneOrFail(Product, {where: {uuid: productUuid}, relations: ['store']});
		cart.store = product.store;
		cart.customer = customer;
		customer.cart = cart;
		await getManager().save(customer);
		await this.save(cart).then(res => res);
	}

	public async addProductToCart(cart: Cart, product: AddProductToCartDto, customer?: Customer) {
		const cartProduct = new CartProduct(product as any);
		cartProduct.cart = cart;
		try {
			const cartProductStore = await this.findCartProductStore(product.productUuid, cart);

			// If Customer tries to add a Product from another Store, destroy the old one and create a new one
			if (!cartProductStore) {
				return this.destroyCart(cart).then(async () => {
					await this.createCart(customer as Customer, product.productUuid);
					return this.addProductToCart(customer!.cart, product, customer);
				});
			}
			cartProduct.product = cartProductStore;
			await getRepository(CartProduct).save(cartProduct);
			cart.products && cart.products.length > 0
				? cart.products.push(cartProduct) : cart.products = [cartProduct];
			await this.save(cart);
			return this.findOneByUuid(cart.uuid, ['products', 'products.product', 'store']);
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
		}
	}

	public async destroyCart(cart: Cart) {
		return this.remove(cart);
	}

	public async findCartProductStore(productUuid: string, cart: Cart): Promise<any> {
		return getRepository(Product)
			.findOne({where: {uuid: productUuid, store: cart.store}});
	}
}
