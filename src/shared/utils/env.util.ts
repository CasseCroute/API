import {config} from 'dotenv';
import {isNil} from './';

declare const process: {
	env: {
		[key: string]: string;
	};
};
config();

export const env = (key: string, fallback: any = null) => {
	return isNil(process.env[key]) ? fallback : process.env[key];
};
