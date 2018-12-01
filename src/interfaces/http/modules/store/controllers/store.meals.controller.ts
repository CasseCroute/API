import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Delete,
	Post,
	Req,
	UnauthorizedException,
	UseGuards,
	UseInterceptors,
	FileInterceptor, UploadedFile, BadRequestException
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {ValidationPipe} from '@letseat/domains/common/pipes/validation.pipe';
import {AuthEntities} from '@letseat/infrastructure/authorization/enums/auth.entites';
import {AuthGuard} from '@letseat/infrastructure/authorization/guards';
import {Meal} from '@letseat/domains/meal/meal.entity';
import {createMealValidatorOptions, updateMealValidatorOptions} from '@letseat/domains/meal/pipes';
import {CreateMealDto} from '@letseat/domains/meal/dtos/create-meal.dto';
import {CreateMealCommand, DeleteMealCommand, UpdateMealCommand} from '@letseat/application/commands/meal';
import {GetStoreMealsQuery} from '@letseat/application/queries/store';
import {isUuid} from '@letseat/shared/utils';
import {UpdateMealDto} from '@letseat/domains/meal/dtos';
import {AWSService} from '@letseat/infrastructure/services/aws.service';
import {SaveMealPictureUrlCommand} from '@letseat/application/commands/meal/save-meal-picture-url.command';

@Controller('stores/me/meals')
export class CurrentStoreMealsController {
	constructor(private readonly commandBus: CommandBus, private readonly awsService: AWSService) {
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public async createMeal(
		@Req() request: any,
		@Body(new ValidationPipe<Meal>(createMealValidatorOptions))meal: CreateMealDto): Promise<any> {
		if (request.user.entity === AuthEntities.Store) {
			return this.commandBus.execute(new CreateMealCommand(request.user.uuid, meal));
		}
		return (() => {
			throw new UnauthorizedException();
		})();
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	public async getMeals(@Req() request: any) {
		return request.user.entity === AuthEntities.Store
			? this.commandBus.execute(new GetStoreMealsQuery(request.user.uuid))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Patch(':uuid')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public async updateMeal(
		@Req() request: any,
		@Body(new ValidationPipe<Meal>(updateMealValidatorOptions)) meal: UpdateMealDto,
		@Param('uuid') uuid: string): Promise<any> {
		return request.user.entity === AuthEntities.Store && isUuid(uuid)
			? this.commandBus.execute(new UpdateMealCommand(request.user.uuid, uuid, meal))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Delete(':uuid')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public async deleteMeal(
		@Req() request: any,
		@Param('uuid') uuid: string): Promise<any> {
		return request.user.entity === AuthEntities.Store && isUuid(uuid)
			? this.commandBus.execute(new DeleteMealCommand(request.user.uuid, uuid))
			: (() => {
				throw new UnauthorizedException();
			})();
	}

	@Post(':uuid/picture')
	@UseInterceptors(FileInterceptor('file'))
	@UseGuards(AuthGuard('jwt'))
	public async uploadMealPicture(
		@Req() request: any,
		@Param('uuid') uuid: string,
		@UploadedFile() file) {
		if (request.user.entity !== AuthEntities.Store) {
			(() => {
				throw new UnauthorizedException();
			})();
		}
		if (!file) {
			(() => {
				throw new BadRequestException('No file uploaded');
			})();
		}
		const uploadImagePromise = this.awsService.uploadImage(file, `lets-eat-co/stores/${request.user.uuid}`, uuid);
		return uploadImagePromise.then(async fileData => {
			return this.commandBus.execute(new SaveMealPictureUrlCommand(request.user.uuid, uuid, fileData.Location));
		}).catch(err => console.log(err));
	}
}
