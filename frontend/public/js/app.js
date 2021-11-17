import { createApp } from './vue.js';

const socket = io();

const app = createApp({
    data() {
        return {
            user: null,
            socket: socket,
        };
    },
    mounted() {
        socket.emit('users', { id: null }, response => {
            if(response.error) {
                console.log(response.error);
            }

            this.user = response.data;
        });
    },
    methods: {
    },
    template: `
        <div class="messaging"></div>
        <users class="users" :socket="socket"></users>
    `,
});

import users from '../components/users/users.js';
app.component('users', users);

import friends from '../components/friends/friends.js';
app.component('friends', friends);

import test from '../components/test/test.js';
app.component('test', test);

app.mount('#app');

console.log('it works!');
