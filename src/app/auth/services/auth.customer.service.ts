import jwt from 'jsonwebtoken';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Injectable} from '@nestjs/common';
import {JwtPayload} from '../interfaces';
import {Type} from '@common';
import passport from 'passport';
import config from 'config';
import {CustomerService} from '../../customer/customer.service';

@Injectable()
export class AuthCustomerService<T> {
	constructor(private readonly resourceService: CustomerService) {
	}

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

	public async validateResourceByEmail(payload: T | any): Promise<any> {
		return this.resourceService.findOneByEmail(payload);
	}

	public async getPassword(resource: T): Promise<any> {
		return this.resourceService.getPassword(resource);
	}

}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
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
