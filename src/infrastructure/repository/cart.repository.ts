import {EntityRepository, getManager, Repository} from 'typeorm';
import {Customer} from '@letseat/domains/customer/customer.entity';
import {Cart, CartProduct} from '@letseat/domains/cart/cart.entity';
import {AddProductToCartDto} from '@letseat/domains/cart/dtos/add-product-to-cart.dto';
import {Product} from '@letseat/domains/product/product.entity';
import {omitDeep} from '@letseat/shared/utils';

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
		await this.save(cart).then(res => res);
	}

	public async addProductToCart(cart: Cart, product: AddProductToCartDto) {
		const cartProduct = new CartProduct(product as any);
		cartProduct.cart = cart;
		cartProduct.product = await getManager().findOneOrFail(Product, {where: {uuid: product.productUuid}});
		await getManager().save(cartProduct);
		cart.products && cart.products.length > 0
			? cart.products.push(cartProduct) : cart.products = [cartProduct];
		await this.save(cart);
		return this.findOneByUuid(cart.uuid, ['products', 'products.product']);
	}
}
