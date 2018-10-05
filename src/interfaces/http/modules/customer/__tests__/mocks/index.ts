import {CreateCustomerDto, LoginCustomerDto} from '@letseat/domains/customer/dtos';

export const customerRepository = {
	data: [
		{
			id: 1,
			uuid: '4d31ffbc-b731-4a31-9ff7-98caa467a3b7',
			firstName: 'Arthur',
			lastName: 'De La Ronde',
			email: 'arthurdlr@mail.me',
			phoneNumber: 1234567890,
			password: 'password1'
		},
		{
			id: 2,
			uuid: '9ac9b672-66b9-4f48-8912-09ac70d76fde',
			firstName: 'Urho',
			lastName: 'Wahlman',
			email: 'urho@wahlman.com',
			phoneNumber: 1234567890,
			password: 'password2'
		},
		{
			id: 3,
			uuid: '6bd8dc8e-fa99-481b-beea-2e4226f72724',
			firstName: 'Erin',
			lastName: 'Bishop',
			email: 'bishop.erin@mail.com',
			phoneNumber: 1234567890,
			password: 'password3'
		},
	],
};

export const commandBus = {
	createOne: async (store: any) => Promise.resolve(customerRepository.data.push(store)),
	findOneByEmail: async (data: any) => {
		return customerRepository.data.find(store => store.email === data.email);
	},
	getPassword: async (data: any) => {
		return customerRepository.data.find(store => store.password === data.password);
	}
};

export const jwtPayload = {
	iat: 1538339647128,
	exp: '7d',
	jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhlbGxsb29vb2hAZ21haWwuY29tIiwiaWF0IjoxNTM4MzM5NjQ3LCJleHAiOjE1Mzg5NDQ0NDd9.lZSOkxPpXaG5MuWWYGB2J2SPwyMWDFk0QBDSzoxQjiE'
};

export const customerCreateDto: CreateCustomerDto = {
	firstName: 'Agrican',
	lastName: 'Deslauriers',
	email: 'deslauriers@whatmail.com',
	phoneNumber: 1234567890,
	password: 'password'
};

export const customerLoginDto: LoginCustomerDto = {
	email: 'arthurdlr@mail.me',
	password: 'password1'
};

export const authService = {
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
