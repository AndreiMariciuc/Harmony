import { Server as SocketServer } from 'socket.io';
import BackendRedirecter from './BackendRedirecter.js';
import loadComponent from './loadComponent.js';

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

	socket.join(session.userId);

	socket.on('users', async ({ id }, cb) => {
		if (id == null) id = session.userId;
		const [err, data] = await backend.get(`/users/${id}`);
		cb(data);
	});

	socket.on('get-component', async ({ component }, cb) => {
		const data = await loadComponent(component);
		cb(data);
	});

	socket.on('users/all', async ({ id, likeUser }, cb) => {
		if (id == null) id = session.userId;
		const [err, data] = await backend.get(`/users/all`, {
			id: id,
			likeUser: likeUser,
		});
		cb(data);
	});

	socket.on('users/requests', async ({ id }, cb) => {
		if (id == null) id = session.userId;
		const [err, data] = await backend.get(`/users/${id}/requests`);
		cb(data);
	});

	socket.on('users/reject', async ({ receiverId, senderId }, cb) => {
		if (receiverId == null) receiverId = session.userId;
		const [err, data] = await backend.delete(`/users/reject`, {
			receiverId: receiverId,
			senderId: senderId,
		});
		cb(data);

		io.to(session.userId).to(senderId).emit('fetch-friends');
	});

	socket.on('users/accept', async ({ receiverId, senderId }, cb) => {
		if (receiverId == null) receiverId = session.userId;
		const [err, data] = await backend.custom(`/users/accept`, {
			method: 'put',
			params: {
				receiverId: receiverId,
				senderId: senderId,
			},
		});
		cb(data);

		io.to(session.userId).to(senderId).emit('fetch-friends');
	});

	socket.on('users/friends', async ({ id }, cb) => {
		if (id == null) id = session.userId;
		const [err, data] = await backend.get(`/users/${id}/friends`);
		cb(data);
	});

	socket.on('users/friends/add', async ({ id, friendId }, cb) => {
		if (id == null) id = session.userId;
		const [err, data] = await backend.post(`/users/${id}/friends/${friendId}`);
		cb(data);

		io.to(session.userId).to(friendId).emit('fetch-friends');
	});

	socket.on('get-messages', async ({ conversation }, cb) => {
		if (conversation == null) return;

		const id = session.userId;
		const [err, data] = await backend.get(
			`/messages/${id}/@me/${conversation.id}`
		);
		console.log(err);
		console.log(data);
		cb(data);
	});

	socket.on('send-private-message', async ({ friendId, msg }, cb) => {
		if (!friendId || !msg) return;

		const id = session.userId;
		console.log(msg);
		const [err, data] = await backend.post(`/messages/${id}/@me/${friendId}`, {
			message: msg,
		});
		console.log(data);
		cb(data);

		if (!data?.data) return;
		io.to(session.userId).to(friendId).emit('private-message', data.data);
	});

	socket.on('disconnect', _ => {
		console.log(`User ${session.userId} has disconnected!`);
	});
}

export { initSocketServer, socketLogic };
