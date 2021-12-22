import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('friends');

const component = {
	template: template,
	props: ['socket', 'conversation'],
	emits: ['user-selected'],
	data() {
		return {
			pendingUsersList: [],
			friendsList: [],
			selectedUser: this.conversation,
		};
	},
	mounted() {
		this.socket.on('fetch-friends', _ => {
			this.getFriends();
			this.getPendingUsers();
		});

		this.getPendingUsers();
		this.getFriends();

		console.log(this.selectedUser);
	},
	watch: {
		conversation(newVal, oldVal) {
			this.selectedUser = newVal;
		},
	},
	methods: {
		getPendingUsers() {
			this.socket.emit('users/requests', { id: null }, response => {
				if (response.error) {
					return console.log(response.error);
				}

				this.pendingUsersList = response.data;
			});
		},
		rejectUser(id) {
			this.socket.emit(
				'users/reject',
				{ receiverId: null, senderId: id },
				response => {
					if (response.error) {
						return console.log(response.error);
					}

					this.getPendingUsers();
					this.getFriends();
				}
			);
		},
		acceptUser(id) {
			this.socket.emit(
				'users/accept',
				{ receiverId: null, senderId: id },
				response => {
					if (response.error) {
						return console.log(response.error);
					}

					this.getPendingUsers();
					this.getFriends();
				}
			);
		},
		getFriends() {
			this.socket.emit('users/friends', { id: null }, response => {
				if (response.error) {
					return console.log(response.error);
				}

				this.friendsList = response.data;
			});
		},
		selectUser(user) {
			this.$parent.$emit('user-selected', { isUser: true, ...user });
		},
	},
};

export default component;
