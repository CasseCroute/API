/**
 * Recursively omit the specified key or keys from an object.
 */
export function omitDeep(keyToSearch, data) {
	if (Array.isArray(data)) {
		return data.map(element => omitDeep(keyToSearch, element));
	}

	if (!data || typeof data !== 'object' || data instanceof Date) {
		return data;
	}

	return Object.keys(data).reduce((partial, key) => {
		if (key === keyToSearch) {
			return partial;
		}
		partial[key] = omitDeep(keyToSearch, data[key]);

		return partial;
	}, {});
}
