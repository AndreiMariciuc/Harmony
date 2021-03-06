// DOM elements.
const localVideoComponent = document.getElementById('local-video');
const remoteVideoComponent = document.getElementById('remote-video');
const audioBtn = document.getElementById('audio-btn');
const videoBtn = document.getElementById('video-btn');
const deafenBtn = document.getElementById('deafen-btn');
const hideVideoBtn = document.getElementById('hide-video-btn');

window.onbeforeunload = leaveRoom;

// Variables.
const socket = io();
const mediaConstraints = {
	audio: true,
	video: { width: 1280, height: 720 },
};
let localStream;
let remoteStream;
let isRoomCreator;
let rtcPeerConnection; // Connection between the local device and the remote peer.
let roomId;
let audioTrack;
let videoTrack;

let isMuted = false;
let isDeafened = false;
let isHidden = false;

// Free public STUN servers provided by Google.
const iceServers = {
	iceServers: [
		{ urls: 'stun:stun.l.google.com:19302' },
		{ urls: 'stun:stun1.l.google.com:19302' },
		{ urls: 'stun:stun2.l.google.com:19302' },
		{ urls: 'stun:stun3.l.google.com:19302' },
		{ urls: 'stun:stun4.l.google.com:19302' },
	],
};

// BUTTON LISTENER ============================================================
videoBtn.addEventListener('click', e => {
	if (!videoTrack) return;
	const newState = !videoTrack.enabled;
	videoTrack.enabled = newState;

	if (newState) videoBtn.classList.remove('disabled');
	else videoBtn.classList.add('disabled');
});

const toggleAudio = e => {
	if (!audioTrack) return;
	if (isDeafened) {
		toggleDeafen();
		if (!e) return;
		if (!isMuted) return;
	}

	const newState = !audioTrack.enabled;
	audioTrack.enabled = newState;

	if (newState) audioBtn.classList.remove('disabled');
	else audioBtn.classList.add('disabled');

	if (e) {
		console.log(`New audio state: ${newState}`);
		isMuted = !newState;
	}
};
audioBtn.addEventListener('click', toggleAudio);

const handleDeafenAudio = isDeafened => {
	if (isMuted) return;

	if (!isDeafened) {
		audioTrack.enabled = true;
		audioBtn.classList.remove('disabled');
		return;
	}

	audioTrack.enabled = false;
	audioBtn.classList.add('disabled');
};
const toggleDeafen = e => {
	if (!remoteVideoComponent) return;

	const newState = !remoteVideoComponent.muted;
	remoteVideoComponent.muted = newState;

	if (!newState) deafenBtn.classList.remove('disabled');
	else deafenBtn.classList.add('disabled');

	handleDeafenAudio((isDeafened = newState));
};
deafenBtn.addEventListener('click', toggleDeafen);

hideVideoBtn.addEventListener('click', e => {
	if (!isHidden) {
		localVideoComponent.style.display = 'none';
		isHidden = true;

		hideVideoBtn.classList.add('disabled');

		return;
	}

	localVideoComponent.style.display = 'initial';
	isHidden = false;
	hideVideoBtn.classList.remove('disabled');
});

// SOCKET EVENT CALLBACKS =====================================================
socket.on('connect', _ => {
	const ids = window.location.href.split('/').slice(-2);
	ids.sort();
	const roomId = `${ids[0]}-${ids[1]}`;
	console.log(roomId);
	joinRoom(roomId);
});

socket.on('room_created', async () => {
	console.log('Socket event callback: room_created');

	await setLocalStream(mediaConstraints);
	isRoomCreator = true;
});

socket.on('room_joined', async () => {
	console.log('Socket event callback: room_joined');

	await setLocalStream(mediaConstraints);
	socket.emit('start_call', roomId);
});

socket.on('change_owner', async () => {
	console.log('Socket event callback: change_owner');

	isRoomCreator = true;
});

socket.on('full_room', () => {
	console.log('Socket event callback: full_room');

	alert('The room is full, please try another one');
});

socket.on('start_call', async () => {
	console.log('Socket event callback: start_call');

	if (isRoomCreator) {
		rtcPeerConnection = new RTCPeerConnection(iceServers);
		addLocalTracks(rtcPeerConnection);
		rtcPeerConnection.ontrack = setRemoteStream;
		rtcPeerConnection.onicecandidate = sendIceCandidate;
		await createOffer(rtcPeerConnection);
	}
});

socket.on('webrtc_offer', async event => {
	console.log('Socket event callback: webrtc_offer');

	if (!isRoomCreator) {
		rtcPeerConnection = new RTCPeerConnection(iceServers);
		addLocalTracks(rtcPeerConnection);
		rtcPeerConnection.ontrack = setRemoteStream;
		rtcPeerConnection.onicecandidate = sendIceCandidate;
		rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
		await createAnswer(rtcPeerConnection);
	}
});

socket.on('webrtc_answer', event => {
	console.log('Socket event callback: webrtc_answer');

	rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
});

socket.on('webrtc_ice_candidate', event => {
	console.log('Socket event callback: webrtc_ice_candidate');

	// ICE candidate configuration.
	var candidate = new RTCIceCandidate({
		sdpMLineIndex: event.label,
		candidate: event.candidate,
	});
	rtcPeerConnection.addIceCandidate(candidate);
});

// FUNCTIONS ==================================================================
function joinRoom(room) {
	roomId = room;
	socket.emit('join_call', { roomId: room });
}

function leaveRoom() {
	socket.emit('leave_call', { roomId: roomId });
}

async function setLocalStream(mediaConstraints) {
	let stream;
	try {
		stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
	} catch (error) {
		console.error('Could not get user media', error);
	}

	localStream = stream;
	localVideoComponent.srcObject = stream;

	localStream.getTracks().forEach(track => {
		if (track.kind === 'audio') audioTrack = track;
		if (track.kind === 'video') videoTrack = track;
	});
}

function addLocalTracks(rtcPeerConnection) {
	localStream.getTracks().forEach(track => {
		rtcPeerConnection.addTrack(track, localStream);
	});
}

async function createOffer(rtcPeerConnection) {
	let sessionDescription;
	try {
		sessionDescription = await rtcPeerConnection.createOffer();
		rtcPeerConnection.setLocalDescription(sessionDescription);
	} catch (error) {
		console.error(error);
	}

	socket.emit('webrtc_offer', {
		type: 'webrtc_offer',
		sdp: sessionDescription,
		roomId,
	});
}

async function createAnswer(rtcPeerConnection) {
	let sessionDescription;
	try {
		sessionDescription = await rtcPeerConnection.createAnswer();
		rtcPeerConnection.setLocalDescription(sessionDescription);
	} catch (error) {
		console.error(error);
	}

	socket.emit('webrtc_answer', {
		type: 'webrtc_answer',
		sdp: sessionDescription,
		roomId,
	});
}

function setRemoteStream(event) {
	remoteVideoComponent.srcObject = event.streams[0];
	remoteStream = event.stream;
}

function sendIceCandidate(event) {
	if (event.candidate) {
		socket.emit('webrtc_ice_candidate', {
			roomId,
			label: event.candidate.sdpMLineIndex,
			candidate: event.candidate.candidate,
		});
	}
}

console.log('merge');
