import { Server as SocketServer } from 'socket.io';
import BackendRedirecter from './BackendRedirecter.js';

const backend = new BackendRedirecter();

let io = null;
function initSocketServer(httpServer) {
	if (io == null) {
		io = new SocketServer(httpServer);
	}

	return io;
}

function socketLogic(socket) {
	const session = socket.request.session;

	socket.on('user-info', async (id, cb) => {
		if (id == null) id = session.userId;
		const [err, data] = await backend.get(`/users/${id}`);
		cb(data);
	});

	socket.on('disconnect', _ => {
		console.log(`User ${session.userId} has disconnected!`);
	});
}

export { initSocketServer, socketLogic };
