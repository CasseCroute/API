import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetStoreMealsQuery} from '@letseat/application/queries/store';
import {MealRepository} from '@letseat/infrastructure/repository/meal.repository';

@CommandHandler(GetStoreMealsQuery)
export class GetStoreMealsHandler implements ICommandHandler<GetStoreMealsQuery> {
	async execute(command: GetStoreMealsQuery, resolve: (value?) => void) {
		const mealRepository = getCustomRepository(MealRepository);
		try {
			const meals = await mealRepository.findStoreMeals(command.storeUuid);
			resolve(meals);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
