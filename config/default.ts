import dotenv from 'dotenv';

dotenv.config();

const env: any = process.env.NODE_ENV;

const development = {
	app: {
		port: process.env.DEV_APP_PORT || 8080
	},
	database: {
		name: process.env.DEV_DB_NAME || 'dev_db',
		host: process.env.DEV_DB_HOST || 'localhost',
		port: process.env.DEV_DB_PORT || 5432,
		username: process.env.DEV_DB_USERNAME || 'root',
		password: process.env.DEV_DB_PASSWORD || '',
	}
};

const test = {
	app: {
		port: process.env.TEST_APP_PORT || 8080
	},
	database: {
		name: process.env.TEST_DB_NAME || 'test_db',
		host: process.env.TEST_DB_HOST || 'localhost',
		port: process.env.TEST_DB_PORT || 5432,
		username: process.env.TEST_DB_USERNAME || 'root',
		password: process.env.TEST_DB_PASSWORD || '',
	}
};

const config: any = {
	development,
	test
};

export default config[env];
