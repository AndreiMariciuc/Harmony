import { createApp } from './vue.js';

const socket = io();

const app = createApp({
	data() {
		return {
			user: null,
		};
	},
	mounted() {
		socket.emit('user-info', null, response => {
			console.log(response);
			this.user = response.data;
		});
	},
	methods: {
		onClick() {},
	},
	template: `
        <p>{{ user?.username }}</p>
        <p>{{ user?.email }}</p>
        <button @click="onClick">Test</button>
    `,
});

app.mount('#app');

console.log('it works!');
