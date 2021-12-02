import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('messaging');

const component = {
    template: template,
    props: ['socket', 'conversation'],
    data() {
        return {
            helpfulMessage: 'Select a friend to get started!',
            messages: [],
            message: "",
            activeConversation: null,
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
        sendMessage() {
            this.socket.emit('send-private-message', {
                friendId: this.activeConversation.id,
                msg: {message: this.message}
            }, response => {
                console.log(response)
                if (response.error) {
                    return console.log(response.error);
                }

                console.log(this.messages);
                this.messages.push(response.data);
            });
            this.message = "";
        }
    },
};

export default component;