import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetStoreIngredientByUuidQuery} from '@letseat/application/queries/store';
import {IngredientRepository} from '@letseat/infrastructure/repository/ingredient.repository';

@CommandHandler(GetStoreIngredientByUuidQuery)
export class GetStoreIngredientByUuidHandler implements ICommandHandler<GetStoreIngredientByUuidQuery> {
	async execute(command: GetStoreIngredientByUuidQuery, resolve: (value?) => void) {
		const ingredientRepository = getCustomRepository(IngredientRepository);
		try {
			const ingredient = await ingredientRepository
				.findStoreIngredientByUuid(command.storeUuid, command.ingredientUuid);
			resolve(ingredient);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
