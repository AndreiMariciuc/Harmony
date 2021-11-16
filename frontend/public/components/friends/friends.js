import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('friends');

const component = {
	template: template,
    props: ['socket'],
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
            this.socket.emit('users/requests', { id: null }, response => {
                if(response.error) {
                    console.log(response.error);
                }

                this.userList = response.data;
            });
        },
        rejectUser(id) {
            this.socket.emit("users/reject", { receiverId: null, senderId: id }, response => {
                if(response.error) {
                    console.log(response.error);
                }

                this.fetchUsers();
            });
        },
        acceptUser(id) {
            this.socket.emit("users/accept", { receiverId: null, senderId: id }, response => {
                if(response.error) {
                    console.log(response.error);
                }

                this.fetchUsers();
            });
        }
    },
};

export default component;