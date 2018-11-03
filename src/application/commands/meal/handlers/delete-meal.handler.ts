import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {DeleteMealCommand} from '../delete-meal.command';
import {BadRequestException} from '@nestjs/common';
import {MealRepository} from '@letseat/infrastructure/repository/meal.repository';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';

@CommandHandler(DeleteMealCommand)
export class DeleteMealHandler implements ICommandHandler<DeleteMealCommand> {
	async execute(command: DeleteMealCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const mealRepository = getCustomRepository(MealRepository);
		const mealProductUuid = command.mealUuid;
		const storeUuid = command.storeUuid;
		try {
			const storeFound = await storeRepository.findOneByUuid(storeUuid);
			await mealRepository.deleteStoreMealByUuid(storeFound.id, mealProductUuid);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
