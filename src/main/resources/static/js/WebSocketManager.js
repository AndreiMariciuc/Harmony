import { uuidv4 } from "./misc.js";

let stompClient = null;
let isConnected = false;
const queue = [];

const requestMap = new Map();

function replyCallback(frame) {

}

class WebSocketManager {
    connect(callback) {
        const socket = new SockJS('/socket-endpoint');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, frame => {
            isConnected = true;
            console.log('Connected: ' + frame);
            stompClient.subscribe('/user/reply/data', replyCallback);
            callback();
        });
    }

    disconnect() {
        if(stompClient !== null) {
            stompClient.disconnect();
        }
        console.log('Disconnected');
    }

    send(endpoint, data = null) {
        if(!isConnected) return;

        stompClient.send(`/socket-message/${endpoint}`, {}, JSON.stringify(data));
    }

    send(endpoint, data = null, callback = null) {
        stompClient.send(`/socket-message/${endpoint}`, {}, JSON.stringify(data));
    }

    on(evt, callback) {
        stompClient.subscribe(evt, callback);
    }
}

const manager = new WebSocketManager();

export default manager;
