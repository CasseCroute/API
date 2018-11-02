import {
	BadRequestException,
	Body, Controller, HttpCode, Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {addProductToCartValidatorOptions, removeProductToCartValidatorOptions} from '@letseat/domains/cart/pipes';
import {Cart} from '@letseat/domains/cart/cart.entity';
import {AddProductOrMealToCartDto} from '@letseat/domains/cart/dtos';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {RemoveProductOrMealToCartDto} from '@letseat/domains/cart/dtos/remove-product-or-meal-to-cart.dto';
import {AddProductOrMealToCartCommand, RemoveProductOrMealToCartCommand} from '@letseat/application/commands/cart';

@Controller('customers/me/cart')
export class CurrentCustomerCartController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Post('/add')
	@HttpCode(200)
	@UseGuards(AuthGuard('jwt'))
	public async addToCart(
		@Req() request: any,
		@Body(new ValidationPipe<Cart>(addProductToCartValidatorOptions)) product: AddProductOrMealToCartDto
	): Promise<any> {
		if (!product.mealUuid && !product.productUuid || product.mealUuid && product.productUuid) {
			throw new BadRequestException();
		}
		return request.user.entity === AuthEntities.Customer
			? this.commandBus.execute(new AddProductOrMealToCartCommand(request.user.uuid, product))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Post('/remove')
	@HttpCode(200)
	@UseGuards(AuthGuard('jwt'))
	public async removeToCart(
		@Req() request: any,
		@Body(new ValidationPipe<Cart>(removeProductToCartValidatorOptions)) product: RemoveProductOrMealToCartDto
	): Promise<any> {
		if (!product.mealUuid && !product.productUuid || product.mealUuid && product.productUuid) {
			throw new BadRequestException();
		}
		return request.user.entity === AuthEntities.Customer
			? this.commandBus.execute(new RemoveProductOrMealToCartCommand(request.user.uuid, product))
			: (() => {
				throw new UnauthorizedException();
			})();
	}
}
