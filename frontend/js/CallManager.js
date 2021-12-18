class Room {
	constructor(id, userIds, setInactive) {
		this.id = id;
		this.userIds = userIds;
		this.setInactive = setInactive;
		this.timeout = setInactive();
		this.connected = [];
		this.size = 0;
	}

	join(id) {
		id = id.toString();
		console.log(id);
		console.log(this.userIds);
		if (!this.userIds.includes(id)) return false;
		this.connected.push(id);
		clearTimeout(this.timeout);
		this.size++;
	}

	disconnect(id) {
		console.log('Last length: ' + this.connected.length);
		this.connected = this.connected.filter(x => x != id);
		console.log('New length: ' + this.connected.length);
		if (this.connected.length <= 0) {
			this.timeout = this.setInactive();
		}
		this.size--;
	}
}

const calls = {};

let instance = null;

class CallManager {
	constructor() {
		if (instance) return instance;
		return (instance = this);
	}

	createRoom(userIds) {
		userIds.sort();
		const roomId = userIds[0] + '-' + userIds[1];
		if (calls[roomId]) {
			console.log(`Room ${roomId} already existst!`);
			return;
		}

		calls[roomId] = new Room(roomId, userIds, _ =>
			setTimeout(_ => {
				console.log(`Deleting inactive room: ${roomId}`);
				calls[roomId] = null;
			}, 10000)
		);

		console.log(`Room ${roomId} has been created!`);

		return calls[roomId];
	}

	getRoom(roomId) {
		return calls[roomId];
	}

	joinRoom(roomId, userId) {
		if (!calls[roomId]) {
			console.log(`Room ${roomId} doesn't exist!`);
			return false;
		}

		calls[roomId].join(userId);
		return true;
	}

	leaveRoom(roomId, userId) {
		if (!calls[roomId]) {
			console.log(`Room ${roomId} doesn't exist!`);
			return false;
		}

		calls[roomId].disconnect(userId);
		return true;
	}
}

export default CallManager;
