import express, { response } from 'express';
import axios from 'axios';
import config from '../public/config/config.js';
import multer from 'multer';
import FormData from 'form-data';
// import request from 'request';

const router = express.Router();

router.get('/:id', async (req, res) => {
	const id = req.params.id;

	// request.get(
	// 	`${config['backend-addr']}/img/${id}`,
	// 	{ encoding: 'binary' },
	// 	(error, response) => {
	// 		if (!error && response.statusCode == 200) {
	// 			res.writeHead(200, {
	// 				'Content-Type': 'image/jpeg',
	// 				'Cache-Control': 'no-cache',
	// 			});
	// 			res.end(response.body, 'binary');
	// 		}
	// 	}
	// );

	try {
		const response = await axios.get(`${config['backend-addr']}/img/${id}`, {
			responseType: 'arraybuffer',
		});
		for (const entry in response.headers) {
			res.setHeader(entry.toString(), response.headers[entry]);
		}
		res.writeHead(response.status);
		res.end(response.data, 'binary');
	} catch (err) {
		console.log(`Error while fetching image: ${err}`);
		res.writeHead(404);
		res.end();
	}
});

const upload = multer({ storage: multer.memoryStorage() });
router.post('/upload', upload.single('image'), async (req, res) => {
	const { file } = req;
	const { buffer, originalname: filename } = file;
	const formData = new FormData();
	formData.append('image', buffer, filename);

	try {
		const response = await axios.post(
			`${config['backend-addr']}/messages/load-image`,
			formData,
			{
				headers: {
					...formData.getHeaders(),
				},
			}
		);
		res.status(response.status);
		res.json(response.data);
	} catch (err) {
		console.log(`Error while uploading image: ${err}`);
		res.writeHead(404);
		res.end();
	}
});

export default router;
