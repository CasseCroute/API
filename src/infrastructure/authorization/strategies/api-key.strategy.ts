import {Injectable} from '@nestjs/common';
import passport from 'passport';
import config from 'config';
import {HeaderAPIKeyStrategy} from 'passport-headerapikey';
import {AuthService} from '@letseat/infrastructure/authorization';
import {PassportStrategy} from '@letseat/infrastructure/authorization/strategies/passport.strategy';

@Injectable()
export class APIKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
	constructor() {
		super({
			header: config.get('apiKeyHeader'),
			prefix: ''
		}, false, async (payload: any, next: any) => APIKeyStrategy.verify(payload, next));
		passport.use('headerapikey', this as any);
	}

	private static async verify(apiKey: string, done: Function) {
		const resource = await AuthService.verifyAPIKey(apiKey);
		if (!resource) {
			return done(true, resource);
		}
		done(null, apiKey);
	}
}
