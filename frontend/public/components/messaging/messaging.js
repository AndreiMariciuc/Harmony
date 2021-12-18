import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('messaging');

import upload_image from '../upload-image/upload-image.js';
import {resolveComponent} from "../../js/vue.js";

const component = {
    template: template,
    props: ['socket', 'conversation'],
    components: {
        "photoComponent": upload_image
    },
    data() {
        return {
            helpfulMessage: 'Select a friend to get started!',
            messages: [],
            message: "",
            activeConversation: null,
            photoState: false,
            image: null
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
        }
    },
    watch: {
        conversation(newVal, oldVal) {
            this.activeConversation = newVal;
            this.getMessages();
        }
    },
    methods: {
        getMessages() {
            this.socket.emit('get-messages', {conversation: this.activeConversation}, response => {
                if (response.error) {
                    return console.log(response.error);
                }
                this.messages = response.data.reverse();
            });
        },
        async sendMessage() {
            let imageUrl = null;
            if (this.image != null) {
                const formData  = new FormData();
                formData.append("image", this.image);

                const response = await fetch('/messages/load-image', {
                    method: 'POST',
                    body: formData,
                });

                console.log(response);

                imageUrl = await response.json();
                console.log(imageUrl);

                    // .then(response => response.json())
                    // .then(imageUrl => {
                    //     // if (accountDto.err == null) {
                    //     //     // window.location.href = '/user';
                    //     //     window.location.reload(true);
                    //     // } else {
                    //     //     document.getElementById('error').innerHTML = accountDto.message;
                    //     // }
                    //     console.log(imageUrl);
                    // });
            }

            this.socket.emit('send-private-message', {
                friendId: this.activeConversation.id,
                msg: {message: this.message}
            }, response => {
                console.log(response)
                if (response.error) {
                    return console.log(response.error);
                }

                console.log(this.messages);
                // this.messages.push(response.data);
            });
            this.message = "";
        },
        changePhotoState() {
            console.log('changed photo state: ' + this.photoState);
            this.photoState = !this.photoState;
            this.image = null;
        },
        handleImageUploaded(image) {
            this.image = image;
        }
    },
};

export default component;