import slugify from 'slugify';
import {cryptoRandomString} from './crypto-random-string.util';

const cleanUpSpecialChars = (string: string) => string
	.replace(/[ÀÁÂÃÄÅàáâãäå]/g, 'a')
	.replace(/[ÈÉÊËéèêë]/g, 'e')
	.replace(/[ÎÏÌÍîïìií]/g, 'i')
	.replace(/[ÛÙÜÚŪûùüúū]/g, 'u');

export default (string: string) => {
	return `${slugify(cleanUpSpecialChars(string), {replacement: '-', lower: true, remove: /[*+~.()'"!:@,;.]/g})}-${cryptoRandomString(10)}`;
};
