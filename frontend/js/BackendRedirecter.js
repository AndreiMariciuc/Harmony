import axios from 'axios';

const BACKEND_ADDR = process.env.BACKEND_ADDR || 'http://localhost:8080';

let instance = null;

async function handleRequest(path, method, data, params) {
	const url = `${BACKEND_ADDR}/${path}`;
	let res = null;
	let err = null;

	try {
		res = (
			await axios({
				method,
				url,
				data,
				params,
			})
		).data;
	} catch (ex) {
		err = ex;
	}

	return [err, res];
}

class BackendRedirecter {
	constructor() {
		if (instance) return instance;
		return (instance = this);
	}

	async get(path, params) {
		return await handleRequest(path, 'get', null, params);
	}

	async post(path, data) {
		return await handleRequest(path, 'post', data, null);
	}

	async delete(path, data) {
		return await handleRequest(path, 'delete', null, data);
	}
}

export default BackendRedirecter;
