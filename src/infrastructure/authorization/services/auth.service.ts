import jwt from 'jsonwebtoken';
import {Injectable} from '@nestjs/common';
import {JwtPayload} from '../interfaces';
import config from 'config';
import redis from 'redis';
import {promisify} from 'util';

@Injectable()
export class AuthService {
	public static createToken<T extends any>(resource: T): JwtPayload {
		const payload = {uuid: resource.uuid, email: resource.email};
		let expiresIn: any = '7d';
		const accessToken = jwt.sign(payload, config.get('jwtSecret'), {expiresIn});
		expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() as number + 7);
		return {
			iat: Date.now(),
			exp: expiresIn.getTime(),
			jwt: accessToken
		};
	}

	public static async verifyAPIKey(apiKey: string) {
		const client = redis.createClient({host: config.get('redis.host'), port: config.get('redis.port')});
		const asyncGetHashMap = promisify(client.hgetall).bind(client);
		return asyncGetHashMap(config.get('redis.apiKeyHashMap'))
			.then(res => {
				client.quit();
				return Object.keys(res).some(key => key === apiKey);
			})
			.catch(err => {
				client.quit();
				return err;
			});

	}
}
