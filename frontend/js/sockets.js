import {Server as SocketServer} from 'socket.io';
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

    socket.on('users', async ({id}, cb) => {
        if (id == null) id = session.userId;
        const [err, data] = await backend.get(`/users/${id}`);
        cb(data);
    });

    socket.on('get-component', async ({component}, cb) => {
        const data = await loadComponent(component);
        cb(data);
    });

    socket.on('users/all', async ({id, likeUser}, cb) => {
        if (id == null) id = session.userId;
        const [err, data] = await backend.get(`/users/all`, {
            id: id,
            likeUser: likeUser,
        });
        cb(data);
    });

    socket.on('users/requests', async ({id}, cb) => {
        if (id == null) id = session.userId;
        const [err, data] = await backend.get(`/users/${id}/requests`);
        cb(data);
    });

    socket.on('users/reject', async ({receiverId, senderId}, cb) => {
        if (receiverId == null) receiverId = session.userId;
        const [err, data] = await backend.delete(`/users/reject`, {
            receiverId: receiverId,
            senderId: senderId,
        });
        cb(data);

        socket.to(session.userId).emit('/fetch-friends');
    });

    socket.on('users/accept', async ({receiverId, senderId}, cb) => {
        if (receiverId == null) receiverId = session.userId;
        const [err, data] = await backend.custom(`/users/accept`, {
            method: 'put',
            params: {
                receiverId: receiverId,
                senderId: senderId,
            }
        });
        cb(data);
    });

    socket.on('users/friends', async ({id}, cb) => {
        if (id == null) id = session.userId;
        const [err, data] = await backend.get(`/users/${id}/friends`);
        cb(data);
    })

    socket.on('disconnect', _ => {
        console.log(`User ${session.userId} has disconnected!`);
    });
}

export {initSocketServer, socketLogic};
