import express from 'express';
import BackendRedirecter from '../js/BackendRedirecter.js';

const router = express.Router();
const backend = new BackendRedirecter();

async function handleAccountAction(action, req, res) {
	const [err, result] = await backend.post(action, req.body);
	if (err) {
		console.log(err);
		res.send({
			err,
		});
		return;
	}

	// console.log(result);
	if (!result.error) req.session.userId = result.data.id;

	res.send(result);
}

router.post(
	'/login',
	async (req, res) => await handleAccountAction('/login', req, res)
);

router.post(
	'/register',
	async (req, res) => await handleAccountAction('/register', req, res)
);

export default router;
