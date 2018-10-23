import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {CreateMealCommand} from '../create-meal.command';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';

@CommandHandler(CreateMealCommand)
export class CreateMealHandler implements ICommandHandler<CreateMealCommand> {
	async execute(command: CreateMealCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const mealProductUuid = command.meal.productUuid;
		const meal = new Meal(command.meal);
		try {
			if (meal.subsections && meal.subsections.length > 0) {
				meal.subsections.forEach(subsection => {
					subsection.allowMultipleSelections = subsection.maxSelectionsPermitted > 1;
				});
			}
			await storeRepository.saveStoreMeal(command.storeUuid, meal, mealProductUuid);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
