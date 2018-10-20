import {
	BadRequestException,
	Body,
	Controller, Delete,
	Get, HttpCode,
	Param, Patch,
	Post,
	Req,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {CommandBus} from '@nestjs/cqrs';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {createIngredientValidatorOptions, updateIngredientValidatorOptions} from '@letseat/domains/ingredient/pipes';
import {CreateIngredientDto, UpdateIngredientDto} from '@letseat/domains/ingredient/dtos';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {
	GetStoreIngredientByUuidQuery,
	GetStoreIngredientsQuery,
} from '@letseat/application/queries/store';
import {isUuid} from '@letseat/shared/utils';
import {
	CreateIngredientCommand,
	DeleteIngredientByUuidCommand,
	UpdateIngredientCommand
} from '@letseat/application/commands/ingredient';

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

	@Patch(':uuid')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public async updateIngredient(
		@Req() request: any,
		@Body(new ValidationPipe<Ingredient>(updateIngredientValidatorOptions)) ingredient: UpdateIngredientDto, @Param('uuid') uuid: string): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new UpdateIngredientCommand(request.user.uuid, uuid , ingredient))
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

	@Delete(':uuid')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public async deleteIngredient(
		@Req() request: any,
		@Param('uuid') uuid: string): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new DeleteIngredientByUuidCommand(request.user.uuid, uuid))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

}
