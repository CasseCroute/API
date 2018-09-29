import {MigrationInterface, QueryRunner} from 'typeorm';
import config from 'config';
import dotenv from 'dotenv';

dotenv.config();

export class InitDatabases1538259097193 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createDatabase(config.get('database.name'), true);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropDatabase(config.get('database.name'), true);
	}

}
