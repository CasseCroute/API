import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetStoreIngredientsQuery} from '@letseat/application/queries/store';
import {IngredientRepository} from '@letseat/infrastructure/repository/ingredient.repository';

@CommandHandler(GetStoreIngredientsQuery)
export class GetStoreIngredientsHandler implements ICommandHandler<GetStoreIngredientsQuery> {
	async execute(command: GetStoreIngredientsQuery, resolve: (value?) => void) {
		const ingredientRepository = getCustomRepository(IngredientRepository);
		try {
			const ingredients = command.isPublic
				? await ingredientRepository.findStoreIngredientsPublic(command.storeUuid)
				: await ingredientRepository.findStoreIngredients(command.storeUuid);
			resolve(ingredients);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
