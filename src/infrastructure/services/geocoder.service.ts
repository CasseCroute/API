import {Injectable} from '@nestjs/common';
import NodeGeocoder, {Options} from 'node-geocoder';

@Injectable()
export class GeocoderService {
	private readonly defaultOptions: Options = {
		provider: 'openstreetmap'
	};
	private readonly geocoder = NodeGeocoder(this.defaultOptions);

	public async geocodeAddress(address: string) {
		return this.geocoder.geocode(address);
	}
}
