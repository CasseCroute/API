/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {IngredientRepository} from '@letseat/infrastructure/repository/ingredient.repository';
import {UpdateIngredientCommand} from '@letseat/application/commands/ingredient';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';

@CommandHandler(UpdateIngredientCommand)
export class UpdateIngredientHandler implements ICommandHandler<UpdateIngredientCommand> {
	async execute(command: UpdateIngredientCommand, resolve: (value?) => void) {
		const ingredientRepository = getCustomRepository(IngredientRepository);
		const storeRepository = getCustomRepository(StoreRepository);

		try {
			const storeFound = await storeRepository.findOneByUuid(command.storeUuid, true);
			const updatedIngredient = await ingredientRepository.updateIngredient(storeFound.id, command.ingredientUuid, command.ingredient);
			resolve();
			return updatedIngredient;
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
