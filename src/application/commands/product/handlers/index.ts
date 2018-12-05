import {CreateProductHandler} from './create-product.handler';
import {UpdateProductHandler} from './update-product.handler';
import {DeleteProductHandler} from './delete-product.handler';
import {SaveProductPictureUrlHandler} from '@letseat/application/commands/product/handlers/save-product-picture-url.handler';

export const ProductCommandHandlers = [
	CreateProductHandler,
	UpdateProductHandler,
	DeleteProductHandler,
	SaveProductPictureUrlHandler
];

export {
	CreateProductHandler,
	UpdateProductHandler,
	DeleteProductHandler,
	SaveProductPictureUrlHandler
};
