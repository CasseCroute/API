const config = require('config');
const dotenv = require('dotenv');

dotenv.config();

module.exports = [
  {
    environment: 'development',
    name: 'default',
    type: 'postgres',
    host: `${config.get('database.host')}`,
    port: `${config.get('database.port')}`,
    username: `${config.get('database.username')}`,
    password: `${config.get('database.password')}`,
    database: `${config.get('database.name')}`,
    synchronize: true,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    autoSchemaSync: true,
    cli: {
      migrationsDir: 'src/database/migrations'
    }
  }
];