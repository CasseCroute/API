import {Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {CommandBus} from '@nestjs/cqrs';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {createIngredientValidatorOptions} from '@letseat/domains/ingredient/pipes';
import {CreateIngredientDto} from '@letseat/domains/ingredient/dtos';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {CreateIngredientCommand} from '@letseat/application/commands/ingredient';
import {GetStoreIngredientsQuery} from '@letseat/application/queries/store';

@Controller('stores/me/ingredients')
export class StoreIngredientsController {
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
