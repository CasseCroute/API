import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository, Repository} from 'typeorm';
import {CreateMealCommand} from '../create-meal.command';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {BadRequestException} from '@nestjs/common';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(CreateMealCommand)
export class CreateMealHandler implements ICommandHandler<CreateMealCommand> {
	async execute(command: CreateMealCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const meal = Meal.register(command.meal);
		try {
			await storeRepository.saveStoreMeal(command.storeUuid, meal, new Repository<Store>());
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
