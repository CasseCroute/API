import {ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {getCustomRepository} from 'typeorm';
import {BadRequestException} from '@nestjs/common';
import {RemoveSectionProductCommand} from '@letseat/application/commands/section';
import {SectionRepository} from '@letseat/infrastructure/repository/section.repository';
import {MealRepository} from '@letseat/infrastructure/repository/meal.repository';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {StoreRepository} from '@letseat/infrastructure/repository/store.repository';
import {Section} from '@letseat/domains/section/section.entity';
import {ProductRepository} from '@letseat/infrastructure/repository/product.repository';
import {Product} from '@letseat/domains/product/product.entity';

@CommandHandler(RemoveSectionProductCommand)
export class RemoveSectionProductHandler implements ICommandHandler<RemoveSectionProductCommand> {
	async execute(command: RemoveSectionProductCommand, resolve: (value?) => void) {
		const storeRepository = getCustomRepository(StoreRepository);
		const sectionRepository = getCustomRepository(SectionRepository);
		const mealRepository = getCustomRepository(MealRepository);
		const productRepository = getCustomRepository(ProductRepository);
		const products = command.section.products;
		const meals = command.section.meals;

		try {
			const store = storeRepository.findOneByUuid(command.storeUuid);
			const section = await sectionRepository.findStoreSectionByUuid(command.storeUuid, command.sectionUuid) as Section;

			if (!store || !section) {
				return;
			}

			if (meals && meals.length > 0) {
				meals.forEach(async mealUuid => {
					const meal = await mealRepository.findOneByUuid(mealUuid) as Meal;

					if (!meal) {
						return;
					}

					return sectionRepository.deleteSectionMealByUuid(section.id, meal.id)
						.then(() => {
							resolve();
						})
						.catch(err => {
							resolve(Promise.reject(new BadRequestException(err.message)));
						});
				});

			}

			if (!(products && products.length > 0)) {
				return;
			}

			products.forEach(async productUuid => {
				const product = await productRepository.findStoreProductByUuid(command.storeUuid, productUuid) as Product;
				return sectionRepository.deleteSectionProductByUuid(section.id, product.id)
					.then(() => {
						resolve();
					})
					.catch(err => {
						resolve(Promise.reject(new BadRequestException(err.message)));
					});
			});
		} catch (err) {
			resolve(Promise.reject(new BadRequestException(err.message)));
		}

	}
}
