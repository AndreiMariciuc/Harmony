import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('messaging');

import upload_image from '../upload-image/upload-image.js';

import config from '../../config/config.js';
import debounce from '../../misc/debounce.js';

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
			debouncer: null,
			needToScroll: false,
			keepTo: null,
		};
	},
	mounted() {
		this.socket.on('private-message', data => {
			console.log('Got private message:', data);
			if (data.sender.id != this.activeConversation.id) {
				console.log('respins');
				return;
			}

			this.messages.push(data);
			this.needToScroll =
				this.$refs.body.scrollTop + this.$refs.body.clientHeight >=
				this.$refs.body.scrollHeight;
		});

		this.debouncer = debounce(_ => {
			// const lastMessage = this.$refs.body?.lastElementChild;
			const lastMessage = document.getElementById(this.keepTo);
			console.log('scroll');

			if (lastMessage) {
				lastMessage.scrollIntoView();
				this.keepTo = null;
			}
		}, 1);

		this.$nextTick(_ => {
			console.log('ref', this.$refs.body);
			if (this.$refs.body) {
				console.log('face ceva');
				this.$refs.body.addEventListener('scroll', e => {
					if (this.$refs.body.scrollTop <= 0) {
						console.log('need to fetch !');
						this.keepTo = this.$refs.body.firstElementChild.id;
						this.getMessages(this.messages.length);
					}
				});
			}
		});
	},
	updated() {
		// this.scrollToElement();
		if (!this.$refs.body) return;
		if (this.keepTo) {
			this.debouncer();
			return;
		}
		if (!this.needToScroll) return;

		console.log('scroll');
		this.$refs.body.scrollTop = this.$refs.body.scrollHeight;
		this.needToScroll = false;
	},
	computed: {
		conversationName() {
			if (this.activeConversation?.isUser) {
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
		getMessages(startIndex) {
			this.socket.emit(
				'get-messages',
				{ conversation: this.activeConversation, startIndex },
				response => {
					if (response.error) {
						return console.log(response.error);
					}

					console.log(response.data);
					if (!startIndex) {
						this.messages = response.data.reverse();
						this.needToScroll = true;
						return;
					}

					response.data = response.data.reverse();
					this.messages.unshift(...response.data);
				}
			);
		},
		async sendMessage() {
			let url = null;
			if (this.image != null) {
				const formData = new FormData();
				formData.append('image', this.image);

				const response = await fetch(`${config['frontend-addr']}/img/upload`, {
					method: 'POST',
					body: formData,
					mode: 'cors',
					headers: new Headers({
						'Access-Control-Allow-Origin': '*',
					}),
				})
					.then(response => response.json())
					.then(data => {
						if (data.error != null) {
							console.log(data.error);
						} else {
							url = data.data;
						}
					});

				this.changePhotoState();
			}

			this.message = this.message.trim();

			if (this.message === '' && url == null) return;

			const message = {
				message: this.message,
				sender: this.user,
				imageUrl: url,
			};

			this.messages.push(message);
			this.needToScroll =
				this.$refs.body.scrollTop + this.$refs.body.clientHeight >=
				this.$refs.body.scrollHeight;

			const index = this.messages.indexOf(message);

			this.socket.emit(
				'send-private-message',
				{
					friendId: this.activeConversation.id,
					msg: { message: this.message, imageUrl: url },
				},
				response => {
					console.log(response);
					if (response.error) {
						return console.log(response.error);
					}
					this.messages[index] = response.data;
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
			this.needToScroll = true;
		},
		joinCall() {
			window.open(
				`${config['frontend-addr']}/call/${this.user.id}/${this.activeConversation.id}`,
				'Call',
				'fullscreen=yes'
			);
		},
		checkLastMessage(id) {
			if (id == 0) return true;

			const lastMessage = this.messages[id - 1];
			const currMessage = this.messages[id];

			const diffMs =
				Date.parse(currMessage.date) - Date.parse(lastMessage.date);
			const diffMin = Math.round(((diffMs % 86400000) % 3600000) / 60000);
			if (diffMin > 10) return true;

			return lastMessage.sender.id != currMessage.sender.id;
		},
		isImage(url) {
			if (url == null) return false;
			const ext = url.split('.').pop().toLowerCase();

			return config.imgs.includes(ext);
		},
		isVideo(url) {
			if (url == null) return false;
			const ext = url.split('.').pop().toLowerCase();

			return config.vids.includes(ext);
		},
		isFile(url) {
			if (url == null) return false;
			if (this.isImage(url)) return false;
			if (this.isVideo(url)) return false;

			return true;
		},
		scrollToElement(options) {
			this.debouncer();
		},
		updateVideo(event) {
			// console.log(event);
			event.target.style.width = 'auto';
			event.target.style.height = 'auto';
		},
		updateImage(event) {
			// console.log(event);
			event.target.style.width = 'auto';
			event.target.style.height = 'auto';
		},
		humanFileSize(bytes, si = false, dp = 1) {
			const thresh = si ? 1000 : 1024;

			if (Math.abs(bytes) < thresh) {
				return bytes.toFixed(dp) + ' B';
			}

			const units = si
				? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
				: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
			let u = -1;
			const r = 10 ** dp;

			do {
				bytes /= thresh;
				++u;
			} while (
				Math.round(Math.abs(bytes) * r) / r >= thresh &&
				u < units.length - 1
			);

			return bytes.toFixed(dp) + ' ' + units[u];
		},
		async getFileSize(msg) {
			if (msg.imageUrl == null) return;

			const response = await fetch(
				`${config['frontend-addr']}/img/data/${msg.imageUrl.split('/').pop()}`,
				{
					method: 'HEAD',
				}
			);

			msg._filesize = this.humanFileSize(
				parseInt(response.headers.get('content-length'), 10),
				true,
				2
			);
			msg._metadataloaded = true;
		},
	},
};

export default component;
