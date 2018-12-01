import {Injectable} from '@nestjs/common';
import AWS from 'aws-sdk';
import config from 'config';

@Injectable()
export class AWSService {
	public readonly S3;

	constructor() {
		AWS.config.update({
			accessKeyId: config.get('aws.accessKeyId'),
			secretAccessKey: config.get('aws.secretAccessKey')
		});
		this.S3 = new AWS.S3();
	}
}
