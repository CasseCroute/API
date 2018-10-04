import {CreateCustomerDto} from '@customer';
import {LoginCustomerDto} from '../../dtos';
export const customerRepository = {
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

export const customerService = {
	createOne: async (customer: any) => Promise.resolve(customerRepository.data.push(customer)),
	findOneByEmail: async (data: any) => {
		return customerRepository.data.find(customer => customer.email === data.email);
	},
	getPassword: async (data: any) => {
		return customerRepository.data.find(customer => customer.password === data.password);
	}
};

export const jwtPayload = {
	iat: 1538339647128,
	exp: '7d',
	jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhlbGxsb29vb2hAZ21haWwuY29tIiwiaWF0IjoxNTM4MzM5NjQ3LCJleHAiOjE1Mzg5NDQ0NDd9.lZSOkxPpXaG5MuWWYGB2J2SPwyMWDFk0QBDSzoxQjiE'
};

export const customerCreateDto: CreateCustomerDto = {
	name: 'Pizza Hut',
	email: 'pizzahut@mail.com',
	phoneNumber: 1234567890,
	password: 'password'
};

export const customerLoginDto: LoginCustomerDto = {
	email: 'hello@burgerking.com',
	password: 'password1'
};

export const authService = {
	validateResourceByEmail: async (payload: any) => {
		return customerService.findOneByEmail(payload).then(res => res);
	},
	getPassword: async (resource: any) => {
		return customerService.getPassword(resource);
	}
};

export const cryptographerService = {
	comparePassword: jest.fn()
		.mockImplementation((candidatePassword, saltedPassword) => {
			return candidatePassword === saltedPassword;
		})
};
