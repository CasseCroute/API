import {Injectable} from '@nestjs/common';
import {ExtractJwt, Strategy} from 'passport-jwt';
import passport from 'passport';
import config from 'config';
import {CommandBus} from '@nestjs/cqrs';
import {GetResourceByUuidQuery} from '@letseat/application/queries/resource';
import {PassportStrategy} from '@letseat/infrastructure/authorization/strategies/passport.strategy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly commandBus: CommandBus) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get('jwtSecret'),
		}, async (payload: any, next: any) => this.verify(payload, next));
		passport.use('jwt', this as any);
	}

	public async verify(payload: any, done: Function) {
		const resource = await this.commandBus.execute(new GetResourceByUuidQuery(payload.uuid, payload.entity));
		if (!resource) {
			return done(true, resource);
		}
		done(null, payload);
	}
}
