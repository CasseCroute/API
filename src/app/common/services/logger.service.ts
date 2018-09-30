import winston, {Logger, LoggerOptions} from 'winston';
import * as chalk from 'chalk';
import PrettyError from 'pretty-error';
import {env} from '@shared';
import * as fs from 'fs';
import {LoggerService as NestLoggerService, Optional} from '@nestjs/common';

const PATHS = {
	LOG: `${process.cwd()}/logs`,
	LOG_ERROR: `${process.cwd()}/logs/_error.log`,
	LOG_INFO: `${process.cwd()}/logs/_info.log`,
	LOG_WARN: `${process.cwd()}/logs/_warn.log`,
	LOG_DEBUG: `${process.cwd()}/logs/_debug.log`,
};

(() => fs.existsSync(PATHS.LOG) || fs.mkdirSync(PATHS.LOG))();

export class LoggerService implements NestLoggerService {
	private readonly logger: Logger;
	private static prevTimestamp: number;
	private readonly prettyError = new PrettyError();
	public static loggerOptions = {
		exitOnError: false,
		transports: [
			LoggerService.logTransports(PATHS.LOG_INFO),
			LoggerService.logTransports(PATHS.LOG_INFO),
			LoggerService.logTransports(PATHS.LOG_WARN),
			LoggerService.logTransports(PATHS.LOG_DEBUG),
		],
	};

	constructor(@Optional() private readonly context: string) {
		this.logger = (winston as any).createLogger(LoggerService.loggerOptions);
		this.prettyError.skipNodeFiles();
		this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
	}

	get Logger() {
		return this.logger;
	}

	static configGlobal(options?: any) {
		LoggerService.loggerOptions = options;
	}

	log(message: string): void {
		const currentDate = new Date();
		this.logger.info(message, {
			filename: PATHS.LOG_INFO,
			timestamp: currentDate.toISOString(),
			context: this.context,
		});
		this.formattedLog('info', message);
	}

	static logTransports(filename: string) {
		return new winston.transports.File({
			filename,
			level: 'info',
			handleExceptions: true,
			maxFiles: 2,
			maxsize: 5242880, // 5MB
		});
	}

	error(message: string, trace?: any): void {
		const currentDate = new Date();
		this.logger.error(`${message} -> (${trace || 'trace not provided !'})`, {
			filename: PATHS.LOG_ERROR,
			timestamp: currentDate.toISOString(),
			context: this.context,
		});
		this.formattedLog('error', message, trace);
	}

	warn(message: string): void {
		const currentDate = new Date();
		this.logger.warn(message, {
			filename: PATHS.LOG_WARN,
			timestamp: currentDate.toISOString(),
			context: this.context,
		});
		this.formattedLog('warn', message);
	}

	overrideOptions(options: LoggerOptions) {
		this.logger.configure(options);
	}

	private static printTimestamp(isTimeDiffEnabled?: boolean): string {
		const includeTimestamp = LoggerService.prevTimestamp && isTimeDiffEnabled;
		if (includeTimestamp) {
			return `+${Date.now() - LoggerService.prevTimestamp} ms`;
		}
		LoggerService.prevTimestamp = Date.now();
		return '';
	}

	private formattedLog(level: string, message: string, error?: any): void {
		let result = '';

		switch (level) {
			case 'info':
				result = this.coloredOutput('INFO', 'blue', message);
				break;
			case 'error':
				result = this.coloredOutput('ERROR', 'red', message);
				if (error && env('NODE_ENV') === 'dev') {
					this.prettyError.render(error, true);
				}
				break;
			case 'warn':
				result = this.coloredOutput('WARN', 'yellow', message);
				break;
			default:
		}
		console.log(result);
	}

	private coloredOutput(level: string, outputColor: string, message): string {
		const color = chalk.default;
		const currentDate = new Date();
		const date = `${currentDate.toLocaleDateString('fr-FR')}`;
		const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
		const dateTime = `${date} - ${time}`;

		return `[${color[outputColor](level)}] ${color.dim.magenta(dateTime)} [${color.green(
			this.context,
		)}] ${message} ${color.yellow(LoggerService.printTimestamp(true))}`;
	}
}
