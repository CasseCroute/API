import {
	Body, Controller, Post, Req, UnauthorizedException, UseGuards
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {createMealValidatorOptions} from '@letseat/domains/meal/pipes';
import {CreateMealDto} from '@letseat/domains/meal/dtos/create-meal.dto';
import {CreateMealCommand} from '@letseat/application/commands/meal';

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
			if (meal.subsections && meal.subsections.length > 0) {
				meal.subsections.forEach(subsection => {
					subsection.allowMultipleSelections = subsection.maxSelectionsPermitted > 1;
				});
			}
			return this.commandBus.execute(new CreateMealCommand(request.user.uuid, meal));
		}
		return (() => {
			throw new UnauthorizedException();
		})();
	}
}
