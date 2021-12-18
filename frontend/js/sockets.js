import { Server as SocketServer } from 'socket.io';
import BackendRedirecter from './BackendRedirecter.js';
import loadComponent from './loadComponent.js';
import CallManager from '../js/CallManager.js';

const backend = new BackendRedirecter();
const callManager = new CallManager();

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

	socket.on('guilds/all', async ({ id }, cb) => {
		if (id == null) id = session.userId;
		const [err, data] = await backend.get(`/guilds/${id}`);
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
		cb(data);
	});

	socket.on('send-private-message', async ({ friendId, msg }, cb) => {
		if (!friendId || !msg) return;

		const id = session.userId;
		console.log(msg);
		const [err, data] = await backend.post(
			`/messages/${id}/@me/${friendId}`,
			msg
		);
		console.log(data);
		cb(data);

		if (!data?.data) return;
		io.to(session.userId).to(friendId).emit('private-message', data.data);
	});

	/// WEBRTC stuffs
	socket.on('join_call', ({ roomId }) => {
		console.log(roomId);
		const id = session.userId.toString();
		const room = callManager.getRoom(roomId) || { size: 0 };

		if (!room.userIds.includes(id)) return;

		const numberOfClients = room.size;
		room.join(id);
		socket.join(roomId);

		if (numberOfClients == 0) {
			socket.emit('room_created');
		} else {
			socket.emit('room_joined');
		}
	});

	socket.on('leave_call', ({ roomId }) => {
		console.log(roomId);
		const id = session.userId.toString();
		const room = callManager.getRoom(roomId) || { size: 0 };

		if (!room.userIds.includes(id)) return;

		const numberOfClients = room.size;
		room.disconnect(id);
		socket.leave(roomId);

		console.log(`User ${id} left the room ${room.id}`);
	});

	socket.on('start_call', roomId => {
		console.log(`Broadcasting start_call event to peers in room ${roomId}`);
		socket.broadcast.to(roomId).emit('start_call');
	});

	socket.on('webrtc_offer', event => {
		console.log(
			`Broadcasting webrtc_offer event to peers in room ${event.roomId}`
		);
		socket.broadcast.to(event.roomId).emit('webrtc_offer', event.sdp);
		console.log(event);
	});

	socket.on('webrtc_answer', event => {
		console.log(
			`Broadcasting webrtc_answer event to peers in room ${event.roomId}`
		);
		socket.broadcast.to(event.roomId).emit('webrtc_answer', event.sdp);
		console.log(event);
	});

	socket.on('webrtc_ice_candidate', event => {
		console.log(
			`Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`
		);
		socket.broadcast.to(event.roomId).emit('webrtc_ice_candidate', event);
		console.log(event);
	});

	socket.on('disconnect', _ => {
		console.log(`User ${session.userId} has disconnected!`);
	});
}

export { initSocketServer, socketLogic };
