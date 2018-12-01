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
	},
	jwtSecret: process.env.JWT_SECRET,
	apiKeyHeader: process.env.LETS_EAT_API_KEY_HEADER,
	letsEatAPIKey: process.env.LETS_EAT_API_KEY,
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT || 6379,
		apiKeyHashMap: process.env.REDIS_API_KEY_HASHMAP || ''
	},
	stripe: {
		publishableKey:  process.env.DEV_STRIPE_PUBLISHABLE_KEY,
		secretKey: process.env.DEV_STRIPE_SECRET_KEY,
		testToken: process.env.STRIPE_TEST_TOKEN
	},
	aws: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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
	},
	jwtSecret: process.env.JWT_SECRET,
	apiKeyHeader: process.env.LETS_EAT_API_KEY_HEADER,
	letsEatAPIKey: process.env.LETS_EAT_API_KEY,
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT || 6379,
		apiKeyHashMap: process.env.REDIS_API_KEY_HASHMAP || ''
	},
	stripe: {
		publishableKey:  process.env.TEST_STRIPE_PUBLISHABLE_KEY,
		secretKey: process.env.TEST_STRIPE_SECRET_KEY,
		testToken: process.env.STRIPE_TEST_TOKEN
	},
	aws: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	}
};

const config: any = {
	development,
	test
};

export default config[env];
