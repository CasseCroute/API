import {Test} from '@nestjs/testing';
import {PhotoController, PhotoService, Photo} from '@photo';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';

describe('PhotoController', () => {
	let photoController: PhotoController;
	let photoService: PhotoService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [PhotoController],
			providers: [PhotoService,
				{
					provide: getRepositoryToken(Photo),
					useValue: mocks.photoRepository
				}]
		}).compile();

		photoController = module.get<PhotoController>(PhotoController);
		photoService = module.get<PhotoService>(PhotoService);
	});

	describe('findAll()', () => {
		it('should return an array of Photos', async () => {
			jest.spyOn(photoService, 'findAll').mockImplementation(() => mocks.photoRepository.data[0]);
			expect(await photoController.findAll()).toBe(mocks.photoRepository.data[0]);
		});
	});

	describe('post()', () => {
		it('should return a Photo', async () => {
			jest.spyOn(photoService, 'createOne').mockImplementation(() => mocks.photoRepository.data[0]);
			expect(await photoController.post()).toBe(mocks.photoRepository.data[0]);
		});
	});
});
