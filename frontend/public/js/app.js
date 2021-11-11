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
		socket.emit('users', null, response => {
			console.log(response);
			this.user = response.data;
		});
	},
	methods: {
		onClick() {},
	},
	template: `
        <users :socket="socket"></users>
		<div class="messaging"></div>
		<div class="friends"></div>
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

app.component('friends', {});

// <p>{{ user?.username }}</p>
//         <p>{{ user?.email }}</p>
//         <button @click="onClick">Test</button>

app.mount('#app');

console.log('it works!');
