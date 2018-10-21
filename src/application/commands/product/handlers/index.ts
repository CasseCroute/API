import {CreateProductHandler} from './create-product.handler';
import {UpdateProductHandler} from './update-product.handler';
import {DeleteProductHandler} from './delete-product.handler';

export const ProductCommandHandlers = [
	CreateProductHandler,
	UpdateProductHandler,
	DeleteProductHandler
];

export {
	CreateProductHandler,
	UpdateProductHandler,
	DeleteProductHandler
};
