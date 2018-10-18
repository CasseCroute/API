import {Body, Controller, HttpCode, Param, Patch, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {CommandBus} from '@nestjs/cqrs';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {createIngredientValidatorOptions} from '@letseat/domains/ingredient/pipes';
import {CreateIngredientDto, UpdateIngredientDto} from '@letseat/domains/ingredient/dtos';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {CreateIngredientCommand, UpdateIngredientCommand} from '@letseat/application/commands/ingredient';

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

	@Patch(':uuid')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public async updateIngredient(
		@Req() request: any,
		@Body(new ValidationPipe<Ingredient>(createIngredientValidatorOptions)) ingredient: UpdateIngredientDto, @Param('uuid') uuid: string): Promise<any> {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new UpdateIngredientCommand(request.user.uuid, uuid , ingredient))
			: (() => {
				throw new UnauthorizedException();
			})();
	}
}
