/* tslint:disable:no-unused */
import {Injectable} from '@nestjs/common';
import AWS from 'aws-sdk';
import config from 'config';
import multerS3 from 'multer-s3';
import path from 'path';

@Injectable()
export class AWSService {
	private readonly S3;

	constructor() {
		AWS.config.update({
			accessKeyId: config.get('aws.accessKeyId'),
			secretAccessKey: config.get('aws.secretAccessKey')
		});

		this.S3 = new AWS.S3();
	}

	public async uploadImage(file: Express.Multer.File, bucket: string, fileName: string) {
		return this.S3.upload({
			Bucket: bucket,
			Body: file.buffer,
			Key: `${fileName}${path.extname(file.originalname)}`,
			ContentType: file.mimetype,
			ACL: 'public-read'
		}).promise();
	}
}
