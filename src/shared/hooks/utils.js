const fetch = require('node-fetch');
const exec = require('child_process').exec;

const createStoreDto = () => {
	return {
		name: 'Let\'s Eat Me',
		email: Math.random().toString(36).substring(2, 11) + '@domain.com',
		phoneNumber: '1234567890',
		password: 'password',
		address: {
			street: '22, rue du Beauvais',
			city: 'Paris',
			zipCode: '75006',
			country: 'France'
		},
		cuisineUuids: []
	}
};

const createCustomerDto = () => {
	return {
		firstName: 'John',
		lastName: 'Doe',
		email: Math.random().toString(36).substring(2, 11) + '@domain.com',
		phoneNumber: '1234567890',
		password: 'password'
	}
};

const createProductDto = () => {
	return {
		reference: 'BURGER',
		name: 'Burger',
		price: '12'
	}
};

const registerStore = () =>
	fetch('http://127.0.0.1:8080/stores/register', {
		method: 'POST',
		body: JSON.stringify(createStoreDto()),
		headers: {'Content-Type': 'application/json'},
	});

const registerCustomer = () =>
	fetch('http://127.0.0.1:8080/customers/register', {
		method: 'POST',
		body: JSON.stringify(createCustomerDto()),
		headers: {'Content-Type': 'application/json'},
	});

const createProduct = (storeJwt) =>
	fetch('http://127.0.0.1:8080/stores/me/products', {
		method: 'POST',
		body: JSON.stringify(createProductDto()),
		headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${storeJwt}`},
	});

const findProductUuid = (client) => client.query('SELECT * from product')
		.then(res => res.rows[0].uuid);

const findStoreUuid = (client) => client.query('SELECT * from store')
	.then(res => res.rows[0].uuid);

const seedDb = () => {
	exec('psql --host localhost -U postgres -d test_letseat < ~/letseat/api/.circleci/seed.sql',
		(error, stdout, stderr) => {
			if (error !== null) {
				console.log(`exec error: ${error}`);
			}
			console.log(`${stdout}`);
			console.log(`${stderr}`);
		});
};

module.exports = {
	registerStore,
	registerCustomer,
	createProduct,
	seedDb,
	findProductUuid,
	findStoreUuid
};
