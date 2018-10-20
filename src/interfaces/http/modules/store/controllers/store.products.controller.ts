import {
	BadRequestException,
	Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {CreateProductDto} from '@letseat/domains/product/dtos/create-product.dto';
import {Product} from '@letseat/domains/product/product.entity';
import {createProductValidatorOptions} from '@letseat/domains/product/pipes/product-validator-pipe-options';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {CreateProductCommand} from '@letseat/application/commands/product';
import {
	GetStoreProductByUuidQuery,
	GetStoreProductsQuery
} from '@letseat/application/queries/store';
import {isUuid} from '@letseat/shared/utils';

@Controller('stores/me/products')
export class CurrentStoreProductsController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public async createProduct(
		@Req() request: any,
		@Body(new ValidationPipe<Product>(createProductValidatorOptions))
			product: CreateProductDto): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new CreateProductCommand(request.user.uuid, product))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	public async getProducts(@Req() request: any): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new GetStoreProductsQuery(request.user.uuid))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Get(':productUuid')
	@UseGuards(AuthGuard('jwt'))
	public async getStoreProductByUuid(
		@Req() request: any,
		@Param('productUuid') productUuid: string
	) {
		return isUuid(productUuid)
			? this.commandBus.execute(new GetStoreProductByUuidQuery(request.user.uuid, productUuid))
			: (() => {
				throw new BadRequestException();
			})();
	}
}

@Controller('stores')
export class StoreProductsController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Get(':storeUuid/products')
	public async getStoreProducts(
		@Param('storeUuid') storeUuid: string) {
		return isUuid(storeUuid)
			? this.commandBus.execute(new GetStoreProductsQuery(storeUuid, true))
			: (() => {
				throw new BadRequestException();
			})();
	}

	@Get(':storeUuid/products/:productUuid')
	public async getStoreProductByUuid(
		@Param('storeUuid') storeUuid: string,
		@Param('productUuid') productUuid: string) {
		return isUuid(storeUuid) && isUuid(productUuid)
			? this.commandBus.execute(new GetStoreProductByUuidQuery(storeUuid, productUuid, true))
			: (() => {
				throw new BadRequestException();
			})();
	}
}
