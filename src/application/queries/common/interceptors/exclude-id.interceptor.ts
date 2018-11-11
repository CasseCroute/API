/* tslint:disable:no-unused */
import {Injectable, NestInterceptor, ExecutionContext} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {omitDeep} from '@letseat/shared/utils';

@Injectable()
export class ExcludeIdInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
		return call$.pipe(map(value => {
			let response = omitDeep('id', value);
			response = omitDeep('events', response);
			return omitDeep('autoCommit', response);
		}));
	}
}
