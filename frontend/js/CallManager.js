class Room {
	constructor(id, userIds, setInactive) {
		this.id = id;
		this.userIds = userIds;
		this.setInactive = setInactive;
		this.timeout = setInactive();
		this.connected = [];
		this.callOwner = null;
	}

	join(id) {
		id = id.toString();
		if (!this.userIds.includes(id)) return false;

		if (this.size <= 0) {
			this.callOwner = id;
		}

		this.connected.push(id);
		clearTimeout(this.timeout);
	}

	disconnect(id) {
		if (id == this.callOwner) {
			this.callOwner = null;
		}

		this.connected = this.connected.filter(x => x != id);
		if (this.size <= 0) {
			this.timeout = this.setInactive();
		}
	}

	changeOwner() {
		if (this.size <= 0) return false;

		this.callOwner = this.connected[0];
		console.log('New call owner is ' + this.callOwner);
		return true;
	}

	get size() {
		return this.connected.length;
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
