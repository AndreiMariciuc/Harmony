import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('find-friends');

const component = {
	template: template,
	props: ['socket'],
	data() {
		return {
			likeUser: '',
			userList: [],
		};
	},
	mounted() {
		this.socket.on('fetch-friends', _ => {
			console.log('refreshu');
			this.fetchUsers();
		});

		this.fetchUsers();
	},
	watch: {
		likeUser(newVal, oldVal) {
			this.fetchUsers();
		},
	},
	methods: {
		fetchUsers() {
			this.socket.emit(
				'users/all',
				{ id: null, likeUser: this.likeUser },
				response => {
					if (response.error) {
						console.log(response.error);
					}

					this.userList = response.data;
				}
			);
		},
		sendFriendRequest(id) {
			this.socket.emit(
				'users/friends/add',
				{ id: null, friendId: id },
				response => {
					if (response.error) {
						console.log(response.error);
					}
				}
			);
		},
	},
};

export default component;