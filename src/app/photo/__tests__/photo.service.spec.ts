import {Test, TestingModule} from '@nestjs/testing';
import {PhotoService, Photo} from '@photo';
import * as mocks from './mocks';
import {getRepositoryToken} from '@nestjs/typeorm';

let photoService: PhotoService;

describe('PhotoService', () => {
	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PhotoService,
				{
					provide: getRepositoryToken(Photo),
					useValue: mocks.photoRepository
				}]
		}).compile();

		photoService = module.get<PhotoService>(PhotoService);
	});

	describe('findAll()', () => {
		it('should return an array of Photo', async () => {
			jest.spyOn(photoService, 'findAll').mockImplementation(() => mocks.photoRepository.data[0]);
			expect(await photoService.findAll()).toBe(mocks.photoRepository.data[0]);
		});
	});

		describe('createOne()', () => {
			it('should add a Photo', async () => {
				jest.spyOn(photoService, 'createOne').mockImplementation(() => mocks.photoRepository.data[0]);
				expect(await photoService.createOne()).toBe(mocks.photoRepository.data[0]);
			});
		});
});
