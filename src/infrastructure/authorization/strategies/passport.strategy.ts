import passport from 'passport';
import {Type} from '@letseat/shared/interfaces';

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
