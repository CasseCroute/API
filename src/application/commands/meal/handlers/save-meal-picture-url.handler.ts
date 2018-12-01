import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {BadRequestException} from '@nestjs/common';
import {defer} from 'rxjs';
import {SaveMealPictureUrlCommand} from '@letseat/application/commands/meal';
import {MealRepository} from '@letseat/infrastructure/repository/meal.repository';

/**
 * Handles a SaveMealPictureUrl command.
 */
@CommandHandler(SaveMealPictureUrlCommand)
export class SaveMealPictureUrlHandler implements ICommandHandler<SaveMealPictureUrlCommand> {
	constructor(
		@InjectRepository(MealRepository)
		private readonly mealRepository: MealRepository) {
	}

	async execute(command: SaveMealPictureUrlCommand, resolve: (value?) => void) {
		defer(async () => {
			return this.mealRepository.saveMealPictureUrl(command.storeUuid, command.mealUuid, command.imageUrl);
		}).subscribe({
			next: () => resolve(),
			error: err => resolve(Promise.reject(new BadRequestException(err.message))),
		});
	}
}
