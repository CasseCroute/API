import {Injectable} from '@nestjs/common';
import {ExtractJwt, Strategy} from 'passport-jwt';
import passport from 'passport';
import config from 'config';
import {Type} from '@letseat/shared/interfaces';
import {CommandBus} from '@nestjs/cqrs';
import {GetResourceByUuidQuery} from '@letseat/application/queries/resource';

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

export function PassportStrategy<T extends Type = any>(passportStrategy: T, name?: string | undefined): {
	new (...args: any[]): T;
} {
	abstract class MixinStrategy extends passportStrategy {
		abstract validate(...args: any[]): any;
		protected constructor(...args: any[]) {
			super(...args, (...params: any[]) => this.validate(...params));
			if (name) {
				passport.use(name, this as any);
			} else {
				passport.use(this as any);
			}
		}
	}
	return MixinStrategy;
}
