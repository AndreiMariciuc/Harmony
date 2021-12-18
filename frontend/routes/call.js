import express from 'express';
import { sendView } from '../js/misc.js';
import CallManager from '../js/CallManager.js';

const router = express.Router();
const callManager = new CallManager();

router.get('/:id1/:id2', (req, res) => {
	const ids = [req.params.id1, req.params.id2];

	if (ids.includes(req.session.userId.toString())) {
		const room = callManager.createRoom(ids);
		// console.log(room);
	}

	sendView(res, 'call');
});

export default router;
