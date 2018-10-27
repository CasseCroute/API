import {CreateStoreDto} from '@letseat/domains/store/dtos';
import httpMock from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import {PassportStrategy} from '@letseat/infrastructure/authorization/strategies/passport.strategy';
import passport from 'passport';
import {ExtractJwt, Strategy} from 'passport-jwt';

export const request = httpMock.createRequest();

export const storeRepository = {
	data: [
		{
			id: 1,
			uuid: '9c1e887c-4a77-47ca-a572-c9286d6b7cea',
			name: 'Burger King',
			email: 'hello@burgerking.com',
			phoneNumber: '1234567890',
			password: 'password1',
			imageUrl: null,
			slug: 'burger-king-f8e2cfacc6'
		},
		{
			id: 2,
			uuid: 'bea6e9dd-fb32-4ebd-bf7e-a04f86a62e56',
			name: 'McDonalds',
			email: 'hello@mcdonalds.com',
			phoneNumber: '1234567890',
			password: 'password2',
			imageUrl: null,
			slug: 'mcdonalds-a822cdcre2'
		},
		{
			id: 3,
			uuid: '2cd4f312-22e8-4d68-8937-4415ed701f84',
			name: 'Subway',
			email: 'hello@subway.com',
			phoneNumber: '1234567890',
			password: 'password3',
			imageUrl: null,
			slug: 'subway-f8e2cfacc6'
		},
	],
};

export const commandBus = {
	createOne: async (store: any) => Promise.resolve(storeRepository.data.push(store)),
	findAll: async () => Promise.resolve(storeRepository.data),
	findOneByEmail: async (data: any) => {
		return storeRepository.data.find(store => store.email === data.email);
	},
	findOneByUuid: async (data: any) => {
		return storeRepository.data.find(store => store.uuid === data.uuid);
	},
	getPassword: async (data: any) => {
		return storeRepository.data.find(store => store.password === data.password);
	},
	findByQueryParams: async (query: any) => {
		return storeRepository.data.find(store => store.name === query);
	}
};

export const jwtPayload = {
	iat: 1538339647128,
	exp: '7d',
	jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhlbGxsb29vb2hAZ21haWwuY29tIiwiaWF0IjoxNTM4MzM5NjQ3LCJleHAiOjE1Mzg5NDQ0NDd9.lZSOkxPpXaG5MuWWYGB2J2SPwyMWDFk0QBDSzoxQjiE'
};

export const storeCreateDto: CreateStoreDto = {
	name: 'Pizza Hut',
	email: 'pizzahut@mail.com',
	phoneNumber: '1234567890',
	password: 'password',
	address: {
		street: '22, rue du Beauvais',
		city: 'Paris',
		zipCode: '75006',
		country: 'France'
	}
};

export const storeLoginDto: any = {
	email: 'hello@burgerking.com',
	password: 'password1'
};

export const authService = {
	validateResourceByUuid: async (payload: any) => {
		return commandBus.findOneByUuid(payload).then(res => res);
	},
	validateResourceByEmail: async (payload: any) => {
		return commandBus.findOneByEmail(payload).then(res => res);
	},
	getPassword: async (resource: any) => {
		return commandBus.getPassword(resource);
	}
};

export const cryptographerService = {
	comparePassword: jest.fn()
		.mockImplementation((candidatePassword, saltedPassword) => {
			return candidatePassword === saltedPassword;
		})
};

export class JwtStrategyMock extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'secretKey',
		}, async (payload: any, next: any) => this.verify(payload, next));
		passport.use('jwt', this as any);
	}

	public async verify(payload: any, done: Function) {
		const user = await authService.validateResourceByUuid(payload);
		if (!user) {
			return done(true, user);
		}
		done(null, payload);
	}
}

const expiresIn = '7d';

export const kioskRepository = {
	data: [
		{
			id: 1,
			uuid: '9cZe887c-4277-47ca-a572-c9286d6b7cea',
			serialNumber: '2X0NFW-E6M36H-AAFLPC-GPS81M',
			idStore: 2
		}
	]
};

export const ingredientRepository = {
	data: [
		{
			id: 1,
			uuid: '2a52fb81-b6e9-4811-9b97-b7721935d986',
			name: 'Tomatoes',
			quantity: 12,
			idStore: 1
		},
		{
			id: 1,
			uuid: '94d4fee2-68a9-42d3-87a8-851ce29d3238',
			name: 'Salad',
			quantity: 34,
			idStore: 1
		}
	]
};

export const productRepository = {
	data: [
		{
			id: 1,
			uuid: '5ea74f95-720e-4e79-8e9d-600fe2ead22a',
			reference: 'BURG-BIG',
			ean13: '501234567890',
			name: 'Big Burger',
			price: '23.12',
			description: 'A delicious Tasty Burger',
			idStore: 1
		},
		{
			id: 2,
			uuid: '5ea12f95-720e-4e79-8e9d-600fe2ead22a',
			reference: 'ICE-CREAM',
			ean13: '978020137962',
			name: 'Strawberry Ice Cream',
			price: '2.12',
			description: 'Ice Cream',
			idStore: 1
		},
	]
};

export const mealRepository = {
	data: [
		{
			id: 1,
			uuid: '2a4dcbb2-39c5-4cdd-aa1e-3d1f407d4d92',
			reference: 'BREAKFASTLUNCH',
			name: 'Breakfast Lunch',
			price: '21.00',
			description: 'For your breakfast',
			idStore: 1,
			idProduct: 2,
			productQuantity: 2
		},
		{
			id: 1,
			uuid: '4a1786f3-a77c-49e7-a430-98338df53528',
			reference: 'MENUBURGER',
			name: 'Menu Burger',
			price: '12.00',
			description: '',
			idStore: 1,
			idProduct: 1,
			productQuantity: 3
		},
	]
};

export const token = jwt.sign({
	uuid: storeRepository.data[0].uuid,
	email: storeRepository.data[0].email,
	entity: 'Store'
}, 'secretKey', {expiresIn});
