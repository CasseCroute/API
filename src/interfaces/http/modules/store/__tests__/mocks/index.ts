import {Type} from '@letseat/shared/interfaces';
import {ExtractJwt, Strategy} from 'passport-jwt';
import passport from 'passport';
import {CreateStoreDto} from '@letseat/domains/store/dtos';
import httpMock from 'node-mocks-http';

export const request = httpMock.createRequest();

export const storeRepository = {
	data: [
		{
			id: 1,
			uuid: '9c1e887c-4a77-47ca-a572-c9286d6b7cea',
			name: 'Burger King',
			email: 'hello@burgerking.com',
			phoneNumber: 1234567890,
			password: 'password1',
			imageUrl: null,
			slug: 'burger-king-f8e2cfacc6'
		},
		{
			id: 2,
			uuid: 'bea6e9dd-fb32-4ebd-bf7e-a04f86a62e56',
			name: 'McDonalds',
			email: 'hello@mcdonalds.com',
			phoneNumber: 1234567890,
			password: 'password2',
			imageUrl: null,
			slug: 'mcdonalds-a822cdcre2'
		},
		{
			id: 3,
			uuid: '2cd4f312-22e8-4d68-8937-4415ed701f84',
			name: 'Subway',
			email: 'hello@subway.com',
			phoneNumber: 1234567890,
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
	phoneNumber: 1234567890,
	password: 'password'
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

export const storeRegisteredData: any = {
	id: 10,
	uuid: 'eff42826-9808-4001-a358-6e214bd4a68b',
	createdAt: '2018-10-05T10:07:19.139Z',
	updatedAt: '2018-10-05T10:07:19.139Z',
	name: 'Hey',
	email: 'alassane@mail.com',
	phoneNumber: 123456000000078900,
	slug: 'hey-5c3a6bd065',
	imageUrl: null
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

export function PassportStrategy<T extends Type = any>(passportStrategy: T, name?: string | undefined): {
	new (...args: any[]): T;
} {
	abstract class MixinStrategy extends passportStrategy {
		abstract validate(...args: any[]): any;

		constructor(...args: any[]) {
			super(...args, (...params: any[]) => this.validate(...params));
			if (name) {
				passport.use(name, this as any);
			} else {
				passport.use(this as any);
			}
		}
	}

	return MixinStrategy;
}
