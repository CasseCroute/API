import {
	Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {createMealValidatorOptions} from '@letseat/domains/meal/pipes';
import {CreateMealDto} from '@letseat/domains/meal/dtos/create-meal.dto';
import {CreateMealCommand} from '@letseat/application/commands/meal';
import {GetStoreMealsQuery} from '@letseat/application/queries/store';

@Controller('stores/me/meals')
export class CurrentStoreMealsController {
	constructor(private readonly commandBus: CommandBus) {
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public async createMeal(
		@Req() request: any,
		@Body(new ValidationPipe<Meal>(createMealValidatorOptions))meal: CreateMealDto): Promise<any> {
		if (request.user.entity === AuthEntities.Store) {
			return this.commandBus.execute(new CreateMealCommand(request.user.uuid, meal));
		}
		return (() => {
			throw new UnauthorizedException();
		})();
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	public async getMeals(@Req() request: any) {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new GetStoreMealsQuery(request.user.uuid))
			: (() => {
				throw new UnauthorizedException();
			})();
	}
}
