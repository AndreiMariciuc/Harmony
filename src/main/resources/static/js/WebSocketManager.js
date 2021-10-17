let stompClient = null;
let isConnected = false;
const queue = [];

class WebSocketManager {
    connect(callback) {
        const socket = new SockJS('/socket-endpoint');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, frame => {
            isConnected = true;
            console.log('Connected: ' + frame);
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

    on(evt, callback) {
        stompClient.subscribe(evt, callback);
    }
}

const manager = new WebSocketManager();

export default manager;
