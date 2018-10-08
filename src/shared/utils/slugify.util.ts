import slugify from 'slugify';
import {cryptoRandomString} from './crypto-random-string.util';

export default (string: string) => {
	return `${slugify(string, {replacement: '-', lower: true})}-${cryptoRandomString(10)}`;
};
