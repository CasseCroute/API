import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {IngredientRepository} from '@letseat/infrastructure/repository/ingredient.repository';
import {DeleteIngredientByUuidCommand} from '@letseat/application/commands/ingredient';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';

@CommandHandler(DeleteIngredientByUuidCommand)
export class DeleteIngredientByUuidHandler implements ICommandHandler<DeleteIngredientByUuidCommand> {
	async execute(command: DeleteIngredientByUuidCommand, resolve: (value?) => void) {
		const ingredientRepository = getCustomRepository(IngredientRepository);
		const storeRepository = getCustomRepository(StoreRepository);
		try {
			const storeFound = await storeRepository.findOneByUuid(command.storeUuid);
			if (storeFound) {
				await ingredientRepository.deleteStoreIngredientByUuid(storeFound.id, command.ingredientUuid);
			}
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
