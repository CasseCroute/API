import {AddProductToCartHandler} from '@letseat/application/commands/cart/handlers/add-product-to-cart.handler';
import {RemoveProductOrMealToCartHandler} from '@letseat/application/commands/cart/handlers/remove-product-or-meal-to-cart.handler';

export const CartCommandHandlers = [
	AddProductToCartHandler,
	RemoveProductOrMealToCartHandler
];

export {
	AddProductToCartHandler,
	RemoveProductOrMealToCartHandler
};
