/* tslint:disable */
import {
	EntityRepository,
	getConnection,
	getManager,
	getRepository,
	ObjectLiteral,
	Repository,
	Transaction,
	TransactionManager,
} from 'typeorm';
import {Store} from '@letseat/domains/store/store.entity';
import {ResourceRepository} from '@letseat/infrastructure/repository/resource.repository';
import {CreateKioskCommand} from '@letseat/application/commands/store/create-kiosk.command';
import {isObjectEmpty, omitDeep} from '@letseat/shared/utils';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {LoggerService} from '@letseat/infrastructure/services';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {MealSubsectionRepository} from '@letseat/infrastructure/repository/meal.subsection.repository';
import {UpdateMealDto} from '@letseat/domains/meal/dtos';
import {MealRepository} from '@letseat/infrastructure/repository/meal.repository';
import {Section} from '@letseat/domains/section/section.entity';
import {CreateSectionDto} from '@letseat/domains/section/dtos/create-section.dto';
import {BadRequestError} from 'passport-headerapikey';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> implements ResourceRepository {
	@Transaction()
	public async saveStore(store: Store, @TransactionManager() storeRepository: Repository<Store>) {
		return storeRepository.save(store);
	}

	public async findOneByEmail(storeEmail: string) {
		return this.findOne({where: {email: storeEmail}});
	}

	public async findByQueryParams(queryParams: any, selectId: boolean = false) {
		const stores = await this.find({where: queryParams});
		return selectId ? stores : omitDeep('id', stores);
	}

	public async findOneByUuid(storeUuid: string, selectId: boolean = false) {
		const store = await this.findOne({
			where: {uuid: storeUuid},
			relations: ['meals', 'meals.product', 'meals.subsections', 'meals.subsections.options', 'products']
		});
		return selectId ? store : omitDeep('id', store);
	}

	public async getPassword(store: Store) {
		return this.findOne({select: ['password'], where: {id: store.id}});
	}

	public async getAddress(storeUuid: string) {
		return getManager()
			.createQueryBuilder(Store, 'store')
			.leftJoinAndSelect('store.address', 'address')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getOne();
	}

	/**
	 * Adds a new Kiosk to a Store using SQL transaction
	 */
	@Transaction()
	public async createKiosk(
		store: Store,
		data: CreateKioskCommand | any,
		@TransactionManager() storeRepository: Repository<Store>): Promise<any> {
		const storeFound = await this.findOne({where: {uuid: store.uuid}, relations: ['kiosks']});
		storeFound!.kiosks.push(data.kiosk);
		return storeRepository.save(storeFound as Store);
	}

	@Transaction()
	public async findOneByPassword(store: Store): Promise<Store | undefined> {
		return this.findOne(store);
	}

	public async updateStore(uuid: string, values: ObjectLiteral) {
		return getRepository(Store).update({uuid}, {...values})
	}

	public static async deleteStoreByUuid(uuid: string) {
		return getConnection()
			.createQueryBuilder()
			.delete()
			.from(Store)
			.where('uuid = :uuid', {uuid})
			.execute();
	}

	@Transaction()
	public async saveIngredient(
		storeUuid: string,
		ingredient: Ingredient,
		@TransactionManager() storeRepository: Repository<Store>) {
		const store = await this.findOne({where: {uuid: storeUuid}, relations: ['ingredients']});
		store!.ingredients.push(ingredient);
		return storeRepository.save(store as Store);
	}

	public async saveStoreProduct(storeUuid: string, productData: Product): Promise<any> {
		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.startTransaction();
		try {
			const product = new Product({...productData});
			const store = await this.findOneOrFail({where: {uuid: storeUuid}, relations: ['products']});
			store!.products.push(product);
			return queryRunner.manager.save([store as Store, product]).then(async (res) => {
				await queryRunner.commitTransaction();
				await queryRunner.release();
				return res[1];
			});
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
		}
	}

	public async saveStoreMeal(
		storeUuid: string,
		meal: Meal,
		mealProductUuid: string) {
		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.startTransaction();
		const mealSubsectionRepository = queryRunner
			.manager.getCustomRepository(MealSubsectionRepository);
		try {
			const store = await this.manager
				.findOneOrFail(Store, {where: {uuid: storeUuid}, relations: ['meals']});
			meal.product = await this.manager
				.findOneOrFail(Product, {
					where: {uuid: mealProductUuid, store: store},
					relations: ['meals', 'store']
				}) as Product;
			store!.meals.push(meal);
			await queryRunner.manager.save([store as Store, meal as Meal]).then(async (res) => {
				await queryRunner.commitTransaction();
				await mealSubsectionRepository.saveStoreMealSubsections(res[1] as Meal);
			});
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
		return;
	}

	public async updateStoreMeal(
		storeUuid: string,
		meal: UpdateMealDto & Meal,
		mealUuid: string) {
		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.startTransaction();
		const mealRepository = queryRunner
			.manager.getCustomRepository(MealRepository);
		const mealSubsectionRepository = queryRunner
			.manager.getCustomRepository(MealSubsectionRepository);
		const {uuid, subsections, ...values} = meal;
		try {
			if (values && !isObjectEmpty(values)) {
				const store = await this.manager
					.findOneOrFail(Store, {where: {uuid: storeUuid}});
				await mealRepository
					.createQueryBuilder()
					.update()
					.set(values)
					.where('id_store = :id and uuid = :uuid', {id: store.id, uuid: mealUuid})
					.execute();
			}
			if (subsections && subsections.length > 0) {
				await mealSubsectionRepository.updateStoreMealSubsections(storeUuid, subsections);
			}
			await queryRunner.commitTransaction();
		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
		return;
	}

	public async saveStoreSection(storeUuid: string, section: CreateSectionDto) {
		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.startTransaction();
		const {meals, products, ...sectionData} = section;
		return new Promise<any>(async (resolve: any, reject: any) => {
			try {
				const store = await this.manager
					.findOneOrFail(Store, {where: {uuid: storeUuid}, relations: ['sections']});
				const newSection = new Section(sectionData);
				if (section.meals && section.meals.length > 0) {
					const meals = section.meals.map(async mealUuid => {
						return getManager().findOneOrFail(Meal, {uuid: mealUuid, store});
					});
					await Promise.all(meals).then(res => {
						newSection.meals = res
					}).catch(() => {
						reject('Some of Meals sent doesn\'t belongs to your Store');
					});
				}
				if (section.products && section.products.length > 0) {
					const products = section.meals.map(async mealUuid => {
						return getManager().findOneOrFail(Product, {uuid: mealUuid, store});
					});
					await Promise.all(products).then(res => {
						newSection.products = res
					}).catch(() => {
						reject('Some of Products sent doesn\'t belongs to your Store');
					});
				}
				store.sections.push(newSection);
				await this.save(store);
				await queryRunner.commitTransaction();
				resolve();
			} catch (err) {
				const logger = new LoggerService('Database');
				logger.error(err.message, err.stack);
				await queryRunner.rollbackTransaction();
				reject();
			} finally {
				await queryRunner.release();
			}
		});
	}
}
