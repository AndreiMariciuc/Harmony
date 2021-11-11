import {createApp} from './vue.js';
import {response} from "express";

const socket = io();

const app = createApp({
    data() {
        return {
            user: null,
            socket: socket,
        };
    },
    mounted() {
        socket.emit('users', null, response => {
            console.log(response);
            this.user = response.data;
        });
    },
    methods: {
        onClick() {
        },
    },
    template: `
        <users :socket="socket"></users>
		<div class="messaging"></div>
		<friends :socket="socket"></friends>
    `,
});

app.component('users', {
    props: ['socket'],
    template: `	<div class="users">
					<input v-model="likeUser" placeholder="Scrie un nume !"/>
					<div v-for="user in userList" :key="user.id">
						<p>{{ user.username }}</p>
					</div>
				</div>`,
    data() {
        return {
            likeUser: '',
            userList: [],
        };
    },
    mounted() {
        this.fetchUsers();
    },
    watch: {
        likeUser(newVal, oldVal) {
            this.fetchUsers();
        },
    },
    methods: {
        fetchUsers() {
            this.socket.emit('users/all', null, this.likeUser, response => {
                this.userList = response;
            });
        },
    },
});

app.component('friends', {
    props: ['socket'],
    template: `
		<div class="friends">
		    <div v-for="user in userList" :key="user.id">
					<p>{{ user.username }}</p>
					<button @click="rejectUser(user.id)">Reject</button>
					<button @click="acceptUser(user.id)">Accept</button>
			</div>
		</div>
	`,
    data() {
        return {
            userList: [],
        };
    },
    mounted() {
        this.fetchUsers();
    },
    methods: {
        fetchUsers() {
            this.socket.emit('users/requests', null, response => {
                this.userList = response;
            });
        },
        rejectUser(id) {
            this.socket.emit("users/reject", null, id, response => {
                console.log(response.message);
                this.fetchUsers();
            })
        },
        acceptUser(id) {

        }
    },
});

// <p>{{ user?.username }}</p>
//         <p>{{ user?.email }}</p>
//         <button @click="onClick">Test</button>

app.mount('#app');

console.log('it works!');
