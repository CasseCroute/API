import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {UpdateMealCommand} from '@letseat/application/commands/meal';
import {UpdateMealDto} from '@letseat/domains/meal/dtos';

@CommandHandler(UpdateMealCommand)
export class UpdateMealHandler implements ICommandHandler<UpdateMealCommand> {
	async execute(command: UpdateMealCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const meal = command.meal as UpdateMealDto & Meal;
		try {
			if (meal.subsections && meal.subsections.length > 0) {
				meal.subsections.forEach(subsection => {
					subsection.allowMultipleSelections = subsection.maxSelectionsPermitted > 1;
				});
			}
			await storeRepository.updateStoreMeal(command.storeUuid, meal, command.mealUuid);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
