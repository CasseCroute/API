import {ExceptionFilter, Catch, HttpStatus, ArgumentsHost, HttpException} from '@nestjs/common';
import {ValidationError} from 'class-validator';
import {JsonWebTokenError} from 'jsonwebtoken';
import {CustomValidationError} from './custom.validation.error';

@Catch(SyntaxError, CustomValidationError, JsonWebTokenError, Error)
export class CustomExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException | CustomValidationError | JsonWebTokenError, host: ArgumentsHost) {
		const errors: any = {};
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		let status;
		if (exception instanceof HttpException) {
			status = exception.getStatus();
		}
		if (exception instanceof CustomValidationError) {
			const validationErrors = retrieveValidationErrors(exception.errors, errors);
			response
				.status(HttpStatus.BAD_REQUEST)
				.json({
					statusCode: HttpStatus.BAD_REQUEST,
					error: 'Bad Request',
					message: 'Validation failed',
					data: validationErrors
				});
			return;
		}
		if (exception instanceof JsonWebTokenError) {
			response.status(HttpStatus.BAD_REQUEST).json({
				nonFieldErrors: [exception.message]
			});
			return;
		}
		if (process.env.DEBUG === 'true' || process.env.DEBUG === '1') {
			console.error(exception);
			response.status(HttpStatus.BAD_REQUEST).json({message: String(exception)});
			return;
		}
		response.status(status).json(exception.message);
	}
}

function retrieveValidationErrors(validationException: any, errors: any) {
	validationException.forEach((error: ValidationError) => {
		if (error.constraints) {
			Object.keys(error.constraints).forEach(
				(key: string) => {
					if (!errors[error.property]) {
						errors[error.property] = [];
					}
					errors[error.property].push(error.constraints[key]);
				}
			);
		}
		if (error.children.length > 0) {
			retrieveValidationErrors(error.children, errors);
		}
	});
	return errors;
}
