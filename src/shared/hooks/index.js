require('dotenv').config();
const utils = require('./utils');
const env = process.env;
const hooks = require('hooks');
const {Client} = require('pg');
client = new Client({
	user: env.TEST_DB_USERNAME,
	host: env.TEST_DB_HOST,
	database: env.TEST_DB_NAME,
	password: env.TEST_DB_PASSWORD,
	port: env.TEST_DB_PORT
});

hooks.beforeAll((transactions, done) => {
	client.connect()
		.then(() => {
			if (env.CI) {
				utils.seedDb()
			}
			done();
		})
		.catch(err => {
			console.log(err);
			return done(err)
		});
});

const customer = {};
const ingredient = {};
const store = {};
const cuisine = {};
const product = {};
const meal = {};

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
	utils.registerCustomer().then(res => res.json())
		.then(json => {
			transaction.request.headers.Authorization = `Bearer ${json.data.jwt}`;
			done();
		})
});

// Before Store Registration
hooks.before('Stores > Store Registration > Register a new Store', (transaction, done) => {
	client.query('SELECT * from cuisine')
		.then(res => {
			cuisine['uuid'] = res.rows[0].uuid;
			cuisine['slug'] = res.rows[0].slug;
			const body = JSON.parse(transaction.request.body);
			body.cuisineUuids.push(cuisine.uuid);
			transaction.request.body = JSON.stringify(body);
			done();
		})
		.catch(err => {
			return done(err);
		});
});

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

hooks.after('Stores > Current Store Profile > Delete Account of the current Store', (transaction, done) => {
	utils.registerStore().then(res => res.json())
		.then(json => {
			store['jwt'] = json.data.jwt;
			utils.createProduct(store['jwt']).then(res => res.json())
				.then(() => {
					client.query('SELECT * from product')
						.then(res => {
							product['uuid'] = res.rows[0].uuid;
							done();
						})
						.catch(err => {
							return done(err);
						})
				})
		});
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
	const body = JSON.parse(transaction.request.body);
	body.cuisineUuid = cuisine.uuid;
	delete body.ingredients;
	transaction.request.body = JSON.stringify(body);
	done();
});

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

// Before Deleting a Store Product by it's UUID
hooks.before('Stores > Current Store Product > Delete a Product', (transaction, done) => {
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

// INGREDIENTS

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

// Before current Store creates a Meal
hooks.before('Stores > Current Store Meals > Create a new Meal', (transaction, done) => {
	const body = JSON.parse(transaction.request.body);
	body.productUuid = product.uuid;
	delete body.subsections;
	transaction.request.body = JSON.stringify(body);
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

// After current Store creates a Meal
hooks.after('Stores > Current Store Meals > Create a new Meal', (transaction, done) => {
	client.query('SELECT * from meal')
		.then(res => {
			meal['uuid'] = res.rows[0].uuid;
			done();
		})
		.catch(err => {
			return done(err);
		})
});

// Before current Store updates a Meal
hooks.before('Stores > Current Store Meal > Update a Meal', (transaction, done) => {
	const body = JSON.parse(transaction.request.body);
	delete body.subsections;
	transaction.request.body = JSON.stringify(body);
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	transaction.request.uri = `/stores/me/meals/${meal.uuid}`;
	transaction.fullPath = `/stores/me/meals/${meal.uuid}`;
	done();
});

hooks.before('Stores > Current Store Meal > Delete a Meal', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	transaction.request.uri = `/stores/me/meals/${meal.uuid}`;
	transaction.fullPath = `/stores/me/meals/${meal.uuid}`;
	done();
});

// SECTIONS
const section = {};

hooks.before('Stores > Current Store Sections > Create a new Section', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	const body = JSON.parse(transaction.request.body);
	delete body.meals;
	delete body.products;
	transaction.request.body = JSON.stringify(body);
	transaction.request.uri = '/stores/me/sections';
	transaction.fullPath = '/stores/me/sections';
	done();
});

hooks.after('Stores > Current Store Sections > Create a new Section', (transaction, done) => {
	client.query('SELECT * from section')
		.then(res => {
			section['uuid'] = res.rows[0].uuid;
			done();
		})
		.catch(err => {
			return done(err);
		});
});

hooks.before('Stores > Current Store Sections > Retrieve Sections', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

hooks.before('Customers > Add Product to Current Customer Cart > Add Product or Meal to Cart', (transaction, done) => {
	utils.registerStore().then(res => res.json())
		.then(json => {
			utils.createProduct(json.data.jwt).then(res => res.json())
				.then(() => {
					client.query('SELECT * from product')
						.then(res => {
							transaction.request.headers.Authorization = `Bearer ${customer.jwt}`;
							const body = JSON.parse(transaction.request.body);
							body.productUuid = res.rows[0].uuid;
							delete body.mealUuid;
							delete body.optionUuids;
							transaction.request.body = JSON.stringify(body);
							done();
						})
						.catch(err => {
							return done(err);
						})
				})
		})
});

hooks.before('Customers > Remove Product from Current Customer Cart > Remove Product or Meal from Cart', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${customer.jwt}`;
	const body = JSON.parse(transaction.request.body);
	body.productUuid = product.uuid;
	delete body.mealUuid;
	transaction.request.body = JSON.stringify(body);
	done();
});

hooks.before('Stores > Current Store Section > Retrieve a Section by UUID', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	transaction.request.uri = `/stores/me/sections/${section.uuid}`;
	transaction.fullPath = `/stores/me/sections/${section.uuid}`;
	done();
});

hooks.before('Stores > Current Store Section > Delete a Section by UUID', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	transaction.request.uri = `/stores/me/sections/${section.uuid}`;
	transaction.fullPath = `/stores/me/sections/${section.uuid}`;
	done();
});


hooks.before('Cuisines > Cuisine > Retrieve list of Cuisine Stores', (transaction, done) => {
	client.query('SELECT * from cuisine')
		.then(res => {
			transaction.request.uri = `/cuisines/${res.rows[0].slug}`;
			transaction.fullPath = `/cuisines/${res.rows[0].slug}`;
			done();
		})
		.catch(err => {
			return done(err);
		})
});

hooks.before('Customers > Orders > Place an Order', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${customer.jwt}`;
	const body = JSON.parse(transaction.request.body);
	body.paymentDetails.id = env.STRIPE_TEST_TOKEN;
	transaction.request.body = JSON.stringify(body);
	done();
});

hooks.before('Customers > Guest Orders > Place an Order', (transaction, done) => {
	const body = JSON.parse(transaction.request.body);
	Promise.all([
		utils.findProductUuid(client),
		utils.findStoreUuid(client)
	]).then(values => {
		body.cart[0].productUuid = values[0];
		body.storeUuid = values[1];
		body.paymentDetails.id = env.STRIPE_TEST_TOKEN;
		delete body.cart[0].mealUuid;
		delete body.cart[0].optionUuids;
		transaction.request.body = JSON.stringify(body);
		done();
	})
});

hooks.before('Customers > Orders > Get Orders', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${customer.jwt}`;
	done();
});

hooks.before('Stores > Current Store Orders > Get Orders', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	done();
});

hooks.before('Stores > Current Store Order > Update Order Status', (transaction, done) => {
	transaction.request.headers.Authorization = `Bearer ${store.jwt}`;
	client.query('SELECT * from order_status')
		.then(res => {
			const body = JSON.parse(transaction.request.body);
			body.orderStatusUuid = res.rows[0].uuid;
			transaction.request.body = JSON.stringify(body);
			done();
		})
		.catch(err => {
			return done(err);
		});
});

hooks.afterAll((transactions, done) => {
	client.query(
		'TRUNCATE TABLE store CASCADE;' +
		'TRUNCATE TABLE customer CASCADE;' +
		'TRUNCATE TABLE ingredient CASCADE;' +
		'TRUNCATE TABLE product CASCADE;' +
		'TRUNCATE TABLE meal CASCADE;' +
		'TRUNCATE TABLE cart CASCADE;' +
		'TRUNCATE TABLE product_ingredient CASCADE;' +
		'TRUNCATE TABLE address CASCADE;' +
		'TRUNCATE TABLE "order" CASCADE;' +
		'TRUNCATE TABLE order_detail_meal CASCADE;' +
		'TRUNCATE TABLE order_detail_meal_option_ingredient CASCADE;' +
		'TRUNCATE TABLE order_detail_meal_option_product CASCADE;' +
		'TRUNCATE TABLE order_detail_product CASCADE;' +
		'TRUNCATE TABLE kiosk CASCADE;')
		.then(() => {
			client.end();
			done();
		})
		.catch(err => {
			console.log(err);
			return done(err)
		});
});
