import jwt from 'jsonwebtoken';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Injectable} from '@nestjs/common';
import {JwtPayload} from '../interfaces';
import {Type} from '@common';
import {Store} from '@store';
import passport from 'passport';
import config from 'config';

@Injectable()
export class AuthService {
	public static createToken<T extends Store>(resource: T): JwtPayload {
		const payload = {uuid: resource.uuid, email: resource.email};
		const expiresIn = '7d';
		const accessToken = jwt.sign(payload, config.get('jwtSecret'), {expiresIn});
		return {
			iat: Date.now(),
			exp: expiresIn,
			jwt: accessToken,
		};
	}

}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get('jwtSecret'),
		}, async (payload: any, next: any) => this.verify(payload, next));
		passport.use('jwt', this as any);
	}

	public async verify(payload: JwtPayload, done: Function) {
		done(null, payload);
	}
}

export function PassportStrategy<T extends Type = any>(passportStrategy: T, name?: string | undefined): {
	new (...args: any[]): T;
} {
	abstract class MixinStrategy extends passportStrategy {
		abstract validate(...args: any[]): any;

		constructor(...args: any[]) {
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
