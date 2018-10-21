/* tslint:disable:strict-type-predicates */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {GetStoreIngredientByUuidQuery} from '@letseat/application/queries/store';
import {IngredientRepository} from '@letseat/infrastructure/repository/ingredient.repository';
import {NotFoundException} from '@nestjs/common';

@CommandHandler(GetStoreIngredientByUuidQuery)
export class GetStoreIngredientByUuidHandler implements ICommandHandler<GetStoreIngredientByUuidQuery> {
	async execute(command: GetStoreIngredientByUuidQuery, resolve: (value?) => void) {
		const ingredientRepository = getCustomRepository(IngredientRepository);
		try {
			const ingredient = command.isPublic
				? await ingredientRepository.findStoreIngredientByUuidPublic(command.storeUuid, command.ingredientUuid)
				: await ingredientRepository.findStoreIngredientByUuid(command.storeUuid, command.ingredientUuid);

			if (typeof ingredient === undefined) {
				resolve(Promise.reject(new NotFoundException('Ingredient not found')));
			}

			resolve(ingredient);
		} catch (err) {
			resolve(Promise.reject((err.message)));
		}
	}
}
