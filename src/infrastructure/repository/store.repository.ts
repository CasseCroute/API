/* tslint:disable */
import {
	EntityRepository,
	getConnection,
	getCustomRepository,
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
import {isObjectEmpty} from '@letseat/shared/utils';
import {Ingredient} from '@letseat/domains/ingredient/ingredient.entity';
import {Product} from '@letseat/domains/product/product.entity';
import {LoggerService} from '@letseat/infrastructure/services';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {MealSubsectionRepository} from '@letseat/infrastructure/repository/meal.subsection.repository';
import {UpdateMealDto} from '@letseat/domains/meal/dtos';
import {MealRepository} from '@letseat/infrastructure/repository/meal.repository';
import {Section} from '@letseat/domains/section/section.entity';
import {CreateSectionDto} from '@letseat/domains/section/dtos/create-section.dto';
import {Cuisine} from '@letseat/domains/cuisine/cuisine.entity';
import {CreateProductDto} from '@letseat/domains/product/dtos';
import {BadRequestException} from '@nestjs/common';
import {CreateStoreDto} from '@letseat/domains/store/dtos';
import {OrderRepository} from '@letseat/infrastructure/repository/order.repository';
import {OrderHistory, OrderStatus} from '@letseat/domains/order/order-history.entity';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> implements ResourceRepository {
	private readonly logger = new LoggerService(StoreRepository.name);
	private readonly orderRepository = getCustomRepository(OrderRepository);
	private readonly orderStatusRepository = getRepository(OrderStatus);
	private readonly orderHistoryRepository = getRepository(OrderHistory);

	public async saveStore(store: Store & CreateStoreDto) {
		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.startTransaction();
		try {

			const cuisines = store.cuisineUuids.map(async cuisineUuid => {
				return await queryRunner.manager
					.getRepository(Cuisine)
					.findOneOrFail({where: {uuid: cuisineUuid}});
			});

			store.cuisines = await Promise.all(cuisines);

			return this.save(store);

		} catch (err) {
			const logger = new LoggerService('Database');
			logger.error(err.message, err.stack);

			await queryRunner.rollbackTransaction();
			await queryRunner.release();

			throw new BadRequestException();
		}
	}

	public async findAll() {
		return this.find({relations: ['cuisines']});
	}

	public async findOneByEmail(storeEmail: string) {
		return this.findOne({where: {email: storeEmail}});
	}

	public async findStoreOrders(storeUuid: string) {
		const store = await this.createQueryBuilder('store')
			.leftJoinAndSelect('store.orders', 'orders')
			.leftJoinAndSelect('orders.customer', 'customer')
			.leftJoinAndSelect('orders.detailsMeals', 'orderDetailsMeals')
			.leftJoinAndSelect('orders.detailsProducts', 'orderDetailsProducts')
			.leftJoinAndSelect('orderDetailsMeals.meal', 'orderDetailsMeal')
			.leftJoinAndSelect('orderDetailsMeals.ingredientOptions', 'orderDetailsMealsIngredientOptions')
			.leftJoinAndSelect('orderDetailsMeals.productOptions', 'orderDetailsMealsProductOptions')
			.leftJoinAndSelect('orderDetailsMealsIngredientOptions.optionIngredient', 'orderDetailsMealIngredientOptionsIngredient')
			.leftJoinAndSelect('orderDetailsMealsProductOptions.optionProduct', 'orderDetailsMealProductOptionsProduct')
			.leftJoinAndSelect('orderDetailsMealIngredientOptionsIngredient.ingredient', 'orderDetailsMealIngredientOptionsIngredientIngredient')
			.leftJoinAndSelect('orderDetailsMealProductOptionsProduct.product', 'orderDetailsMealProductOptionsProductProduct')
			.leftJoinAndSelect('orderDetailsProducts.product', 'orderDetailsProduct')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getOne();

		return store ? store.orders : undefined;
	}

	public async findByQueryParams(queryParams: any): Promise<Store[] | Store | undefined> {
		const stores: Store[] = await this.find({
			select: ['uuid'],
			where: queryParams
		});
		const storesUuids: string[] = stores.map((store) => Object.values(store))
			.reduce((acc, val) => acc.concat(val), []);
		return storesUuids.length > 1 ? this.findManyByUuid(storesUuids) : this.findOneByUuid(storesUuids[0]);
	}

	public async findOneByUuid(storeUuid: string): Promise<Store | undefined> {
		let store = await this.createQueryBuilder('store')
			.leftJoinAndSelect('store.address', 'address')
			.leftJoinAndSelect('store.cuisines', 'cuisines')
			.leftJoinAndSelect('store.sections', 'sections')
			.leftJoinAndSelect('sections.meals', 'meals')
			.leftJoinAndSelect('meals.subsections', 'subsections')
			.innerJoinAndSelect('subsections.options', 'options')
			.innerJoinAndSelect('options.products', 'optionProducts')
			.innerJoinAndSelect('optionProducts.product', 'optionProduct')
			.innerJoinAndSelect('options.ingredients', 'optionIngredients')
			.innerJoinAndSelect('optionIngredients.ingredient', 'optionIngredient')
			.leftJoinAndSelect('sections.products', 'products')
			.where('store.uuid = :uuid', {uuid: storeUuid})
			.getOne();

		if (!store) {
			store = await this.findOneOrFail({
				where: {uuid: storeUuid},
				relations: [
					'cuisines',
					'sections',
					'sections.meals',
					'sections.meals.product',
					'sections.meals.subsections',
					'sections.meals.subsections.options',
					'sections.products'
				]
			});
		}
		return store;
	}

	public async findManyByUuid(storesUuids: string[]): Promise<Store[]> {
		return this.createQueryBuilder('store')
			.leftJoinAndSelect('store.cuisines', 'cuisines')
			.leftJoinAndSelect('store.sections', 'sections')
			.leftJoinAndSelect('sections.meals', 'meals')
			.leftJoinAndSelect('meals.subsections', 'subsections')
			.leftJoinAndSelect('subsections.options', 'options')
			.leftJoinAndSelect('options.products', 'optionProducts')
			.leftJoinAndSelect('optionProducts.product', 'optionProduct')
			.leftJoinAndSelect('options.ingredients', 'optionIngredients')
			.leftJoinAndSelect('optionIngredients.ingredient', 'optionIngredient')
			.leftJoinAndSelect('sections.products', 'products')
			.where('store.uuid IN (:...uuid)', {uuid: storesUuids})
			.getMany();
	}

	public async getPassword(store: Store) {
		return this.findOne({select: ['password'], where: {id: store.id}});
	}

	public async getAddress(storeUuid: string) {
		return this.createQueryBuilder('store')
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

	public async saveStoreProduct(storeUuid: string, product: Product & CreateProductDto): Promise<any> {
		const queryRunner = getConnection().createQueryRunner();
		await queryRunner.startTransaction();
		try {
			const {cuisineUuid, ...data} = product;
			const newProduct = new Product({...data});
			const store = await this.findOneOrFail({where: {uuid: storeUuid}, relations: ['products']});

			if (cuisineUuid) {
				newProduct.cuisine = await queryRunner.manager
					.getRepository(Cuisine)
					.findOneOrFail({where: {uuid: cuisineUuid}});
			}

			store.products.push(newProduct);

			return queryRunner.manager
				.save([store, newProduct])
				.then(async res => {
					await queryRunner.commitTransaction();
					await queryRunner.release();
					// Return the Product inserted
					return res[1];
				});
		} catch (err) {
			this.logger.error(err.message, err.stack);
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			throw new BadRequestException();
		}
	}

	public async updateOrderStatus(storeUuid: string, orderUuid: string, orderStatusUuid: string) {
		try {
			const history = new OrderHistory();
			const order = await this.orderRepository.findOneByUuid(orderUuid,['history', 'history.status', 'store']);
			const status = await this.orderStatusRepository.findOneOrFail({uuid: orderStatusUuid});

			if (order && status && order.store.uuid === storeUuid) {
				history.status = status;
				history.order = order;
				return this.orderHistoryRepository.save(history).then(async () => {
					const order = await this.orderRepository.findOneByUuid(orderUuid, ['history', 'history.status']);
					order!.history = order!.history.sort((a, b) => {
						return b.createdAt.getTime() - a.createdAt.getTime();
					});
					return order;
				});
			}
		}
		catch (err) {
			this.logger.error(err.message, err.stack);
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
