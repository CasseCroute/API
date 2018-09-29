export const photoRepository = {
	data: [
		{
			id: 1,
			uuid: '9c1e887c-4a77-47ca-a572-c9286d6b7cea',
			name: 'Photo 1',
			description: 'Hello',
			fileName: 'hello.jpg',
			views: 12,
			isPublished: true
		},
		{
			id: 2,
			uuid: 'dc085131-76e7-4b77-966a-f59a8c3fe0b3',
			name: 'Photo 2',
			description: 'Mountains view',
			fileName: 'mountains.png',
			views: 62,
			isPublished: false
		},
		{
			id: 3,
			uuid: 'd2af834e-4f68-4bc7-9c7f-6ba134b55c1',
			name: 'Photo 3',
			description: 'Beautiful house',
			fileName: 'house.jpg',
			views: 122,
			isPublished: true
		},

	],
};

export const photoService = {
	findAll: () => photoRepository.data,
	createOne: () => photoRepository.data[0][0]
};
