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

const ingredient = {};

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


// Before retrieving all Customers
hooks.before('Customers > Customers > List all Customers', (transaction, done) => {
	transaction.request.headers['Lets-Eat-API-Key'] = env.LETS_EAT_API_KEY;
	done();
});

// Before retrieving Customer by its UUID
hooks.before('Customers > Customer > Retrieve a Customer By his UUID', (transaction, done) => {
	transaction.request.headers['Lets-Eat-API-Key'] = env.LETS_EAT_API_KEY;
	transaction.request.uri = `/customers/${customer.uuid}`;
	transaction.fullPath = `/customers/${customer.uuid}`;
	done();
});

// Before updating current Customer profile
hooks.before('Customers > Current Customer Profile > Update Profile of the current Customer', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${customer.jwt}`;
	done();
});

// Before current Customer deletes his account
hooks.before('Customers > Current Customer Profile > Delete Account of the current Customer', (transaction, done) => {
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

// Before current Customer deletes his account
hooks.before('Stores > Current Store Profile > Delete Account of the current Store', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

// Before adding a Kiosk
hooks.before('Stores > Current Store Kiosks > Create a Kiosk', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

// Before updating current Store profile
hooks.before('Stores > Current Store Profile > Update Profile of the current Store', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

// Before adding a Product
hooks.before('Stores > Current Store Products > Create a new Product', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

// PRODUCTS
const product = {};

// After current Store add and Ingredient
hooks.after('Stores > Current Store Products > Create a new Product', (transaction, done) => {
	client.query('SELECT * from product')
		.then(res => {
			product['uuid'] = res.rows[0].uuid;
			done();
		})
		.catch(err => {
			return done(err);
		})
});

// Before current Store retrieve Products
hooks.before('Stores > Current Store Products > Retrieve Products', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

// Before current Store updates a Product
hooks.before('Stores > Current Store Product > Update a Product', (transaction, done) => {
	const {ingredients, ...body} = JSON.parse(transaction.request.body);
	transaction.request.body = JSON.stringify(body);
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	transaction.request.uri = `/stores/me/products/${product.uuid}`;
	transaction.fullPath = `/stores/me/products/${product.uuid}`;
	done();
});

// Before current Store retrieve a Product by it's UUID
hooks.before('Stores > Current Store Product > Retrieve Product by UUID', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	transaction.request.uri = `/stores/me/products/${product.uuid}`;
	transaction.fullPath = `/stores/me/products/${product.uuid}`;
	done();
});

// Before retrieving Store Products
hooks.before('Stores > Store Products > Retrieve Store Products', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

// Before retrieving a Store Product by it's UUID
hooks.before('Stores > Store Products > Retrieve a Store Product ', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	transaction.request.uri = `/stores/${store.uuid}/products/${product.uuid}`;
	transaction.fullPath = `/stores/${store.uuid}/products/${product.uuid}`;
	done();
});

// Before adding an Ingredient
hooks.before('Stores > Current Store Ingredients > Create a new Ingredient', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});


// Before current Store updates an Ingredient
hooks.before('Stores > Current Store Ingredient > Update an Ingredient', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	transaction.request.uri = `/stores/me/ingredients/${ingredient.uuid}`;
	transaction.fullPath = `/stores/me/ingredients/${ingredient.uuid}`;
	done();
});

// Before current Store deletes an Ingredient
hooks.before('Stores > Current Store Ingredient > Delete an Ingredient', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	transaction.request.uri = `/stores/me/ingredients/${ingredient.uuid}`;
	transaction.fullPath = `/stores/me/ingredients/${ingredient.uuid}`;
	done();
});

// After adding an Ingredient
hooks.after('Stores > Current Store Ingredients > Create a new Ingredient', (transaction, done) => {
	client.query('SELECT * from ingredient')
		.then(res => {
			ingredient['uuid'] = res.rows[0].uuid;
			done();
		})
		.catch(err => {
			return done(err);
		})
});

// Before retrieving store Ingredients
hooks.before('Stores > Current Store Ingredients > Get Ingredients', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

// Before retrieving a store Ingredient by it's UUID
hooks.before('Stores > Current Store Ingredient > Get Ingredient by UUID', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	transaction.request.uri = `/stores/me/ingredients/${ingredient.uuid}`;
	transaction.fullPath = `/stores/me/ingredients/${ingredient.uuid}`;
	done();
});

// Before retrieving a store Ingredients
hooks.before('Stores > Store Ingredients > Retrieve Store Ingredients', (transaction, done) => {
	transaction.request.uri = `/stores/${store.uuid}/ingredients`;
	transaction.fullPath = `/stores/${store.uuid}/ingredients`;
	done();
});

// Before retrieving a store Ingredient by it's UUID
hooks.before('Stores > Store Ingredients > Retrieve a Store Ingredient', (transaction, done) => {
	transaction.request.uri = `/stores/${store.uuid}/ingredients/${ingredient.uuid}`;
	transaction.fullPath = `/stores/${store.uuid}/ingredients/${ingredient.uuid}`;
	done();
});


hooks.afterAll((transactions, done) => {
	client.query(
		'TRUNCATE TABLE store CASCADE;' +
		'TRUNCATE TABLE customer CASCADE;' +
		'TRUNCATE TABLE ingredient CASCADE;' +
		'TRUNCATE TABLE product CASCADE;' +
		'TRUNCATE TABLE product_ingredient CASCADE;' +
		'TRUNCATE TABLE address CASCADE;' +
		'TRUNCATE TABLE kiosk CASCADE;')
		.then(res => {
			client.end();
			done();
		})
		.catch(err => {
			console.log(err);
			return done(err)
		});
});
