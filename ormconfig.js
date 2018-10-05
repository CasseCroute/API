const config = require('config');
require('dotenv').config();

module.exports =
	{
		environment: process.env.NODE_ENV,
		name: 'default',
		type: 'postgres',
		host: `${config.get('database.host')}`,
		port: `${config.get('database.port')}`,
		username: `${config.get('database.username')}`,
		password: `${config.get('database.password')}`,
		database: `${config.get('database.name')}`,
		synchronize: true,
		entities: ['src/domains/**/*.entity.ts'],
		migrations: ['src/migrations/*.ts'],
		cli: {
			migrationsDir: 'src/migrations'
		}
	};
