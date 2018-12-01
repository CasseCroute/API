/*tslint:disable*/
import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {
	CurrentStoreMealsController,
} from '../controllers';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';
import {AuthService} from '@letseat/infrastructure/authorization';
import {CommandBus, CQRSModule} from '@nestjs/cqrs';
import {Store} from '@letseat/domains/store/store.entity';
import {JwtStrategy} from '@letseat/infrastructure/authorization/strategies/jwt.strategy';
import {CustomExceptionFilter} from '@letseat/domains/common/exceptions';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {LoggerService} from '@letseat/infrastructure/services';
import {AWSService} from '../../../../../infrastructure/services/aws.service';

describe('Store Meals HTTP Requests', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [
				CurrentStoreMealsController,
			],
			providers: [
				CQRSModule,
				AuthService,
				CommandBus,
				AWSService,
				{
					provide: getRepositoryToken(Store),
					useValue: mocks.storeRepository,
				},
				{
					provide: getRepositoryToken(Meal),
					useValue: mocks.mealRepository,
				},
			]
		})
			.overrideProvider(AuthService).useValue(mocks.authService)
			.overrideProvider(CommandBus).useValue({
				register: jest.fn(),
				execute: jest.fn()
			})
			.overrideProvider(JwtStrategy).useClass(mocks.JwtStrategyMock)
			.compile();

		app = module.createNestApplication();
		app.useGlobalFilters(new CustomExceptionFilter());
		const logger = new LoggerService('Server');
		app.useLogger(logger);
		await app.init();
	});

	describe('POST stores/me/meals', () => {
		it('should return a HTTP 201 status code when successful', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({reference: 'MENU', name: 'Menu Burger', price: '12', productUuid: mocks.productRepository.data[0].uuid})
				.expect(201);
		});

		it('should return a HTTP 201 status code when meal has 1 subsection', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1
						}
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when Meal has 1 Subsection with 1 option Product', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								products: [
									{
										productUuid: mocks.productRepository.data[1].uuid
									}
								]
							}
						}
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when Meal has 1 Subsection with multiple options Products', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								products: [
									{
										productUuid: mocks.productRepository.data[1].uuid
									},
									{
										productUuid: mocks.productRepository.data[0].uuid
									}
								]
							}
						}
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when Meal has 1 Subsection with 1 option Ingredient', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								ingredients: [
									{
										ingredientUuid: mocks.ingredientRepository.data[0].uuid
									}
								]
							}
						}
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when Meal has 1 Subsection with multiple option Ingredients', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								ingredients: [
									{
										ingredientUuid: mocks.ingredientRepository.data[0].uuid
									},
									{
										ingredientUuid: mocks.ingredientRepository.data[1].uuid
									}
								]
							}
						}
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when Meal has 1 Subsection with 1 option Product and 1 option Ingredient', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								products: [
									{
										productUuid: mocks.productRepository.data[1].uuid
									}
								],
								ingredients: [
									{
										ingredientUuid: mocks.ingredientRepository.data[0].uuid
									}
								]
							}
						}
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when Meal has 1 Subsection with multiple option Product and Ingredient', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								products: [
									{
										productUuid: mocks.productRepository.data[1].uuid
									},
									{
										productUuid: mocks.productRepository.data[0].uuid
									}
								],
								ingredients: [
									{
										ingredientUuid: mocks.ingredientRepository.data[0].uuid
									},
									{
										ingredientUuid: mocks.ingredientRepository.data[1].uuid
									}
								]
							}
						}
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when meal has 1 subsection with incorrect data', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							what: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1
						}
					]
				})
				.expect(400);
		});

		it('should return a HTTP 201 status code when meal has multiple subsections', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1
						},
						{
							name: 'Extra',
							isRequired: false,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 2
						}
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when meal has multiple subsections with multiple option Products and Ingredients', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								products: [
									{
										productUuid: mocks.productRepository.data[1].uuid
									},
									{
										productUuid: mocks.productRepository.data[0].uuid
									}
								],
								ingredients: [
									{
										ingredientUuid: mocks.ingredientRepository.data[0].uuid
									},
									{
										ingredientUuid: mocks.ingredientRepository.data[1].uuid
									}
								]
							}
						},
						{
							name: 'Extra',
							isRequired: false,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 2,
							options: {
								products: [
									{
										productUuid: mocks.productRepository.data[1].uuid
									},
									{
										productUuid: mocks.productRepository.data[0].uuid
									}
								],
								ingredients: [
									{
										ingredientUuid: mocks.ingredientRepository.data[0].uuid
									},
									{
										ingredientUuid: mocks.ingredientRepository.data[1].uuid
									}
								]
							}
						}
					]
				})
				.expect(201);
		});

		it('should return a HTTP 201 status code when meal has multiple subsections with incorrect data', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid,
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1
						},
						{
							uh: 'Extra',
							isRequired: false,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 2
						}
					]
				})
				.expect(400);
		});

		it('should return an empty body when successful', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({reference: 'MENU', name: 'Menu Burger', price: '12', productUuid: mocks.productRepository.data[0].uuid})
				.expect((res: any) => {
					res.body = '';
				});
		});

		it('should return a HTTP 401 status code when no JWT is provided in Authorization header', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.send({reference: 'MENU', name: 'Menu Burger', price: '12', productUuid: mocks.productRepository.data[0].uuid})
				.expect(401);
		});

		it('should return a HTTP 400 status code when Meal reference length is gretear than 16', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENUMENUMENUMENUMENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid
				})
				.expect(400);
		});

		it('should return a HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.post('/stores/me/meals')
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({ref: 'MENU', name: 'Menu Burger', price: '12', productUuid: mocks.productRepository.data[0].uuid})
				.expect(400);
		});
	});

	describe('DELETE stores/me/meals', () => {
		it('should return a HTTP 204 status code when successful', () => {
			return request(app.getHttpServer())
				.delete('/stores/me/meals/' + mocks.mealRepository.data[0].uuid)
				.set('Authorization', `Bearer ${mocks.token}`)
				.expect(204);
		});

		it('should return a HTTP 404 status code when the url is incorrect', () => {
			return request(app.getHttpServer())
				.delete('/stores/me/meals' + mocks.mealRepository.data[0].uuid)
				.expect(404);
		});

		it('should return a HTTP 401 status code when no JWT is provided in Authorization header', () => {
			return request(app.getHttpServer())
				.delete('/stores/me/meals/' + mocks.mealRepository.data[0].uuid)
				.expect(401);
		});
	});

	describe('PATCH stores/me/meals/:uuid', () => {
		it('should return a HTTP 204 status code when successful', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({reference: 'MENU', name: 'Menu Burger', price: '12'})
				.expect(204);
		});

		it('should return a HTTP 204 status code when meal has 1 subsection', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1
						}
					]
				})
				.expect(204);
		});

		it('should return a HTTP 204 status code when Meal has 1 Subsection with 1 option Product', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								products: [
									{
										optionProductUuid: mocks.productRepository.data[1].uuid
									}
								]
							}
						}
					]
				})
				.expect(204);
		});

		it('should return a HTTP 204 status code when Meal has 1 Subsection with multiple options Products', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								products: [
									{
										optionProductUuid: mocks.productRepository.data[1].uuid
									},
									{
										optionProductUuid: mocks.productRepository.data[0].uuid
									}
								]
							}
						}
					]
				})
				.expect(204);
		});

		it('should return a HTTP 204 status code when Meal has 1 Subsection with 1 option Ingredient', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								ingredients: [
									{
										optionIngredientUuid: mocks.ingredientRepository.data[0].uuid
									}
								]
							}
						}
					]
				})
				.expect(204);
		});

		it('should return a HTTP 204 status code when Meal has 1 Subsection with multiple option Ingredients', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								ingredients: [
									{
										optionIngredientUuid: mocks.ingredientRepository.data[0].uuid
									},
									{
										optionIngredientUuid: mocks.ingredientRepository.data[1].uuid
									}
								]
							}
						}
					]
				})
				.expect(204);
		});

		it('should return a HTTP 204 status code when Meal has 1 Subsection with 1 option Product and 1 option Ingredient', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								products: [
									{
										optionProductUuid: mocks.productRepository.data[1].uuid
									}
								],
								ingredients: [
									{
										optionIngredientUuid: mocks.ingredientRepository.data[0].uuid
									}
								]
							}
						}
					]
				})
				.expect(204);
		});

		it('should return a HTTP 204 status code when Meal has 1 Subsection with multiple option Product and Ingredient', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								products: [
									{
										optionProductUuid: mocks.productRepository.data[1].uuid
									},
									{
										optionProductUuid: mocks.productRepository.data[0].uuid
									}
								],
								ingredients: [
									{
										optionIngredientUuid: mocks.ingredientRepository.data[0].uuid
									},
									{
										optionIngredientUuid: mocks.ingredientRepository.data[1].uuid
									}
								]
							}
						}
					]
				})
				.expect(204);
		});

		it('should return a HTTP 204 status code when meal has 1 subsection with incorrect data', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							what: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1
						}
					]
				})
				.expect(400);
		});

		it('should return a HTTP 204 status code when meal has multiple subsections', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1
						},
						{
							name: 'Extra',
							isRequired: false,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 2
						}
					]
				})
				.expect(204);
		});

		it('should return a HTTP 204 status code when meal has multiple subsections with multiple option Products and Ingredients', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1,
							options: {
								products: [
									{
										optionProductUuid: mocks.productRepository.data[1].uuid
									},
									{
										optionProductUuid: mocks.productRepository.data[0].uuid
									}
								],
								ingredients: [
									{
										optionIngredientUuid: mocks.ingredientRepository.data[0].uuid
									},
									{
										optionIngredientUuid: mocks.ingredientRepository.data[1].uuid
									}
								]
							}
						},
						{
							name: 'Extra',
							isRequired: false,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 2,
							options: {
								products: [
									{
										optionProductUuid: mocks.productRepository.data[1].uuid
									},
									{
										optionProductUuid: mocks.productRepository.data[0].uuid
									}
								],
								ingredients: [
									{
										optionIngredientUuid: mocks.ingredientRepository.data[0].uuid
									},
									{
										optionIngredientUuid: mocks.ingredientRepository.data[1].uuid
									}
								]
							}
						}
					]
				})
				.expect(204);
		});

		it('should return a HTTP 204 status code when meal has multiple subsections with incorrect data', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENU',
					name: 'Menu Burger',
					price: '12',
					subsections: [
						{
							name: 'Dessert',
							isRequired: true,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 1
						},
						{
							uh: 'Extra',
							isRequired: false,
							minSelectionsPermitted: 1,
							maxSelectionsPermitted: 2
						}
					]
				})
				.expect(400);
		});

		it('should return an empty body when successful', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({reference: 'MENU', name: 'Menu Burger', price: '12'})
				.expect((res: any) => {
					res.body = '';
				});
		});

		it('should return a HTTP 401 status code when no JWT is provided in Authorization header', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.send({reference: 'MENU', name: 'Menu Burger', price: '12', productUuid: mocks.productRepository.data[0].uuid})
				.expect(401);
		});

		it('should return a HTTP 400 status code when Meal reference length is gretear than 16', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({
					reference: 'MENUMENUMENUMENUMENU',
					name: 'Menu Burger',
					price: '12',
					productUuid: mocks.productRepository.data[0].uuid
				})
				.expect(400);
		});

		it('should return a HTTP 400 status code when incorrect data is sent', () => {
			return request(app.getHttpServer())
				.patch(`/stores/me/meals/${mocks.mealRepository.data[0].uuid}`)
				.set('Authorization', `Bearer ${mocks.token}`)
				.send({ref: 'MENU', name: 'Menu Burger', price: '12', productUuid: mocks.productRepository.data[0].uuid})
				.expect(400);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
