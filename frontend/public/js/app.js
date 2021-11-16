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
        onClick() {
        },
    },
    template: `
        <users class="users" :socket="socket"></users>
		<div class="messaging"></div>
		<friends class="friends" :socket="socket"></friends>
    `,
});

import users from '../components/users/users.js';
app.component('users', users);

import friends from '../components/friends/friends.js';
app.component('friends', friends);

import test from '../components/test/test.js';
app.component('test', test);

// socket.emit('get-component', 'test', data => {
// 	app.component('test', data);
// 	console.log(data);
// 	app.mount('#app');
// });

app.mount('#app');

console.log('it works!');
