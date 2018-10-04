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

const store = {};

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


// After Store Registration
hooks.after('Stores > Store Registration > Register a new Store', (transaction, done) => {
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
hooks.before('Stores > Stores > Retrieve a Store', (transaction, done) => {
	transaction.request.uri = `/stores/${store.uuid}`;
	transaction.fullPath = `/stores/${store.uuid}`;
	done();
});

hooks.afterAll((transactions, done) => {
client.query('TRUNCATE TABLE store; TRUNCATE TABLE customer;')
	.then((res) => {
		client.end();
		done();
	})
	.catch(err => {
		console.log(err);
		return done(err)
	});
});
