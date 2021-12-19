import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('messaging');

import upload_image from '../upload-image/upload-image.js';

const component = {
	template: template,
	props: ['socket', 'conversation', 'user'],
	components: {
		photoComponent: upload_image,
	},
	data() {
		return {
			helpfulMessage: 'Select a friend to get started!',
			messages: [],
			message: '',
			activeConversation: null,
			photoState: false,
			image: null,
		};
	},
	mounted() {
		this.socket.on('private-message', data => {
			console.log('Got private message:', data);
			this.messages.push(data);
		});
	},
	computed: {
		conversationName() {
			if (this.activeConversation.isUser) {
				return this.activeConversation.username;
			}

			return 'Hello World!';
		},
	},
	watch: {
		conversation(newVal, oldVal) {
			this.activeConversation = newVal;
			this.getMessages();
		},
	},
	methods: {
		getMessages() {
			this.socket.emit(
				'get-messages',
				{ conversation: this.activeConversation },
				response => {
					if (response.error) {
						return console.log(response.error);
					}
					this.messages = response.data.reverse();
				}
			);
		},
		async sendMessage() {
			let url = null;
			if (this.image != null) {
				const formData = new FormData();
				formData.append("image", this.image);

				const response = await fetch(
					'http://127.0.0.1:8080/messages/load-image',
					{
						method: 'POST',
						body: formData,
						mode: 'cors',
						headers: new Headers({
							'Access-Control-Allow-Origin': '*',
						}),
					}
				).then(response => response.json())
					.then(data => {
						if(data.error != null) {
							console.log(data.error);
						} else {
							url = data.data;
						}
					});

				this.image = null;
			}

			this.socket.emit(
				'send-private-message',
				{
					friendId: this.activeConversation.id,
					msg: { message: this.message,
						   imageUrl: url
					},
				},
				response => {
					console.log(response);
					if (response.error) {
						return console.log(response.error);
					}

					console.log(this.messages);
				}
			);
			this.message = '';
		},
		changePhotoState() {
			console.log('changed photo state: ' + this.photoState);
			this.photoState = !this.photoState;
			this.image = null;
			this.$refs.imageupload.value = null;
		},
		handleImageUpload(event) {
			const currImage = event.target.files[0];
			this.image = currImage;
			this.photoState = true;
		},
		joinCall() {
			window.open(
				`http://localhost:3000/call/${this.user.id}/${this.activeConversation.id}`,
				'Call',
				'fullscreen=yes'
			);
		},
	},
};

export default component;
