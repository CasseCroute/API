/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {IngredientRepository} from '@letseat/infrastructure/repository/ingredient.repository';
import {DeleteIngredientCommand} from '@letseat/application/commands/ingredient';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';

@CommandHandler(DeleteIngredientCommand)
export class DeleteIngredientHandler implements ICommandHandler<DeleteIngredientCommand> {
	async execute(command: DeleteIngredientCommand, resolve: (value?) => void) {
		const ingredientRepository = getCustomRepository(IngredientRepository);
		const storeRepository = getCustomRepository(StoreRepository);

		try {
			const storeFound = await storeRepository.findOneByUuid(command.storeUuid, true);
			await ingredientRepository.deleteIngredient(storeFound.id, command.ingredientUuid);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
