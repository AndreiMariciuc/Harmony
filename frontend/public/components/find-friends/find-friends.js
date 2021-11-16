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
        this.fetchUsers();
    },
    watch: {
        likeUser(newVal, oldVal) {
            this.fetchUsers();
        },
    },
    methods: {
        fetchUsers() {
            this.socket.emit('users/all', { id: null, likeUser: this.likeUser }, response => {
                if(response.error) {
                    console.log(response.error);
                }

                this.userList = response.data;
            });
        },
    },
};

export default component;