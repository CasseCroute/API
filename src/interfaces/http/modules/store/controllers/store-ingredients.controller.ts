import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {CommandBus} from '@nestjs/cqrs';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {createIngredientValidatorOptions} from '@letseat/domains/ingredient/pipes';
import {CreateIngredientDto} from '@letseat/domains/ingredient/dtos';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {CreateIngredientCommand} from '@letseat/application/commands/ingredient';
import {
	GetStoreIngredientByUuidQuery,
	GetStoreIngredientsQuery,
} from '@letseat/application/queries/store';
import {isUuid} from '@letseat/shared/utils';

@Controller('stores')
export class StoreIngredientsController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Get(':storeUuid/ingredients')
	public async getStoreIngredients(
		@Param('storeUuid') storeUuid: string) {
		return isUuid(storeUuid)
			? this.commandBus.execute(new GetStoreIngredientsQuery(storeUuid, true))
			: (() => {
				throw new BadRequestException();
			})();
	}

	@Get(':storeUuid/ingredients/:ingredientUuid')
	public async getStoreIngredientByUuid(
		@Param('storeUuid') storeUuid: string,
		@Param('ingredientUuid') ingredientUuid: string) {
		return isUuid(storeUuid) && isUuid(ingredientUuid)
			? this.commandBus.execute(new GetStoreIngredientByUuidQuery(storeUuid, ingredientUuid, true))
			: (() => {
				throw new BadRequestException();
			})();
	}
}

@Controller('stores/me/ingredients')
export class CurrentStoreIngredientsController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public async createIngredient(
		@Req() request: any,
		@Body(new ValidationPipe<Ingredient>(createIngredientValidatorOptions)) ingredient: CreateIngredientDto): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new CreateIngredientCommand(request.user.uuid, ingredient))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Get(':uuid')
	@UseGuards(AuthGuard('jwt'))
	public async getIngredientsByUuid(@Req() request: any, @Param('uuid') uuid: string) {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new GetStoreIngredientByUuidQuery(request.user.uuid, uuid))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	public async getIngredients(@Req() request: any) {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new GetStoreIngredientsQuery(request.user.uuid))
			: (() => {
				throw new UnauthorizedException();
			})();
	}
}
