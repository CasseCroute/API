import {CanActivate, ExecutionContext, mixin, UnauthorizedException} from '@nestjs/common';
import passport from 'passport';
import {AuthGuardOptions} from '../interfaces/auth-guard-options.interface';
import {Request, Response} from 'express';
import {Type} from '@letseat/shared/interfaces';

export const defaultOptions = {
	session: false,
	property: 'user',
	callback: (err: any, resource: any) => {
		if (err || !resource) {
			throw new UnauthorizedException();
		}
		return resource;
	}
};

const createPassportContext = (request: Request, response: Response) => async (type: string, options: any = defaultOptions) =>
	new Promise((resolve, reject) =>
		passport.authenticate(type, options, (err, resource, info) => {
			try {
				return resolve(options.callback(err, resource, info));
			} catch (err) {
				reject(err);
			}
		})(request, response, resolve)
	);

export function AuthGuard(type: any, options: AuthGuardOptions & { [key: string]: any } = defaultOptions): Type<CanActivate> {
	return mixin(
		class implements CanActivate {
			async canActivate(context: ExecutionContext): Promise<boolean> {
				const httpContext = context.switchToHttp();
				const [request, response] = [
					httpContext.getRequest(),
					httpContext.getResponse()
				];

				const passportFn = createPassportContext(request, response);
				const resource = await passportFn(type, options);
				request[options.property || defaultOptions.property] = resource;
				return true;
			}

			async logIn<TRequest extends { logIn: Function } = any>(request: TRequest | any): Promise<void> {
				const resource = request[options.property || defaultOptions.property];
				await new Promise((resolve: any, reject: any) =>
					request.logIn((res: any = resource, err: any) => (err ? reject(err) : resolve(res)))
				);
			}
		}
	);
}
