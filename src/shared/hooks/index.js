require('dotenv').config();
const env = process.env;
const hooks = require('hooks');
const {Client} = require('pg');
const client = new Client({
	user: env.TEST_DB_USERNAME,
	host: env.TEST_DB_HOST,
	database: env.TEST_DB_NAME,
	password: env.TEST_DB_PASSWORD,
	port: env.TEST_DB_PORT
});

hooks.beforeAll((transactions, done) => {
	client.connect()
		.then(() => {
			done()
		})
		.catch(err => {
			console.log(err);
			return done(err)
		});
});

// CUSTOMER
const customer = {};

// After Customer Registration
hooks.after('Customers > Customer Registration > Register a new Customer', (transaction, done) => {
	const response = JSON.parse(transaction.real.body);
	customer['jwt'] = response.data.jwt;
	client.query('SELECT * from customer')
		.then(res => {
			customer['uuid'] = res.rows[0].uuid;
			done();
		})
		.catch(err => {
			return done(err);
		})
});

// Before retrieving Customer profile
hooks.before('Customers > Current Customer Profile > Retrieve Profile of the current Customer', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${customer.jwt}`;
	done();
});

// Before retrieving Customer by its UUID
hooks.before('Customers > Customer > Retrieve a Customer By his UUID', (transaction, done) => {
	transaction.request.headers['Lets-Eat-API-Key'] = env.LETS_EAT_API_KEY;
	transaction.request.uri = `/customers/${customer.uuid}`;
	transaction.fullPath = `/customers/${customer.uuid}`;
	done();
});

// Before updating Customer profile
hooks.before('Customers > Current Customer Profile > Update Profile of the current Customer', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${customer.jwt}`;
	done();
});

// STORE
const store = {};
// After Store Registration
hooks.after('Stores > Store Registration > Register a new Store', (transaction, done) => {
	const response = JSON.parse(transaction.real.body);
	store['jwt'] = response.data.jwt;
	client.query('SELECT * from store')
		.then(res => {
			store['uuid'] = res.rows[0].uuid;
			done();
		})
		.catch(err => {
			return done(err);
		})
});

// Before retrieving Store by UUID
hooks.before('Stores > Store > Retrieve a Store', (transaction, done) => {
	transaction.request.uri = `/stores/${store.uuid}`;
	transaction.fullPath = `/stores/${store.uuid}`;
	done();
});

// Before retrieving Store profile
hooks.before('Stores > Current Store Profile > Retrieve Profile of the current Store', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

hooks.afterAll((transactions, done) => {
	client.query('TRUNCATE TABLE store; TRUNCATE TABLE customer;')
		.then(res => {
			client.end();
			done();
		})
		.catch(err => {
			console.log(err);
			return done(err)
		});
});
