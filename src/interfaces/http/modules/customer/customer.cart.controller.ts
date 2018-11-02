import {
	BadRequestException,
	Body, Controller, HttpCode, Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {addProductToCartValidatorOptions} from '@letseat/domains/cart/pipes';
import {Cart} from '@letseat/domains/cart/cart.entity';
import {AddProductOrMealToCartDto} from '@letseat/domains/cart/dtos';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {AddProductOrMealToCartCommand} from '@letseat/application/commands/cart/add-product-or-meal-to-cart.command';

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
}
