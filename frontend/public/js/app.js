import { createApp } from './vue.js';

const socket = io();

const app = createApp({
    data() {
        return {
            user: null,
            socket: socket,
            activeConversation: null,
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
        handleUserSelected(conversation) {
            console.log(conversation);
            this.activeConversation = conversation;
        }
    },
    template: `
        <messaging class="messaging" :socket="socket" :conversation="activeConversation"></messaging>
        <users class="users" :socket="socket" @user-selected="handleUserSelected"></users>
    `,
});

import users from '../components/users/users.js';
app.component('users', users);

import friends from '../components/friends/friends.js';
app.component('friends', friends);

import messaging from '../components/messaging/messaging.js';
app.component('messaging', messaging);

app.mount('#app');

console.log('it works!');
