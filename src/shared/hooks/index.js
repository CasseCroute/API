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

hooks.afterAll((transactions, done) => {
client.query('TRUNCATE TABLE store')
	.then((res) => {
		client.end();
		done();
	})
	.catch(err => {
		console.log(err);
		return done(err)
	});
});
