import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository, Repository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {CreateIngredientCommand} from '../create-ingredient.command';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Store} from '@letseat/domains/store/store.entity';

@CommandHandler(CreateIngredientCommand)
export class CreateIngredientHandler implements ICommandHandler<CreateIngredientCommand> {
	async execute(command: CreateIngredientCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const ingredient = Ingredient.register(command.ingredient);
		try {
			await storeRepository.saveIngredient(command.storeUuid, ingredient, new Repository<Store>());
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
