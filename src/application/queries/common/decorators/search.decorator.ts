import {createParamDecorator, UnprocessableEntityException} from '@nestjs/common';
import {Request} from 'express';
import {QueryParams} from '../../store/enums/stores-search-params.enum';
import {isObjectEmpty} from '@letseat/shared/utils';

// @TODO Handle multiple params search
export const Search: Function = createParamDecorator((_: string, req: Request) => {
	if (isObjectEmpty(req.query)) {
		return false;
	}
	const isQueryValid = Object.values(QueryParams).some(val => val === Object.keys(req.query)[0]);
	if (isQueryValid) {
		return req.query;
	}
	throw new UnprocessableEntityException('Search query is not valid');
});
