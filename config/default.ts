import dotenv from 'dotenv';

dotenv.config();

const env: any = process.env.NODE_ENV;

const development = {
	app: {
		port: process.env.DEV_APP_PORT || 8080
	},
	database: {
		name: process.env.DEV_DB_NAME || 'db',
		host: process.env.DEV_DB_HOST || 'localhost',
		port: process.env.DEV_DB_PORT || 5432,
	}
};

const config: any = {
	development,
};

export default config[env];
