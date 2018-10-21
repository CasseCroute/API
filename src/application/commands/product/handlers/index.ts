import {CreateProductHandler} from './create-product.handler';
import {UpdateProductHandler} from './update-product.handler';

export const ProductCommandHandlers = [
	CreateProductHandler,
	UpdateProductHandler
];

export {
	CreateProductHandler,
	UpdateProductHandler
};
