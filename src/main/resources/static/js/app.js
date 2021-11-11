import { createApp } from './vue.js';
import socketManager from './WebSocketManager.js';

const app = createApp({
    data() {
        return {
            user: null,
        }
    },
    mounted() {
        socketManager.connect(_ => {
            socketManager.on('/user/topic/user-info', data => {
                this.user = JSON.parse(data.body);
                console.log(this.user);
            });

            socketManager.send('/user-info');
        });
    },
    methods: {
        onClick() {

        }
    },
    template: `
        <p>{{ user?.username }}</p>
        <button @click="onClick">Test</button>
    `
});

app.mount('#app');

console.log('it works!')