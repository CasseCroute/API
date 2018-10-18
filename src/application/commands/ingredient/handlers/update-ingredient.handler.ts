/* tslint:disable:no-unused */
import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {IngredientRepository} from '@letseat/infrastructure/repository/ingredient.repository';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {UpdateIngredientCommand} from '@letseat/application/commands/ingredient';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';

@CommandHandler(UpdateIngredientCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateIngredientCommand> {
	async execute(command: UpdateIngredientCommand, resolve: (value?) => void) {
		const ingredientRepository = getCustomRepository(IngredientRepository);
		const storeRepository = getCustomRepository(StoreRepository);
		const ingredient = Ingredient.register(command);
		const {uuid, ...valuesToUpdate} = ingredient;
		try {
			const ingredientFound = await storeRepository.getIngredient(command.storeUuid);
			await ingredientRepository.updateIngredient(ingredientFound, valuesToUpdate);
			resolve();
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}
	}
}
