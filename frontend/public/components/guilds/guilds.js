import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('guilds');

const component = {
    template: template,
    props: ['socket'],
    data() {
        return {
            guilds: [],
        };
    },
    mounted() {
        this.socket.on('fetch-friends', _ => {
            console.log('refreshu');
            this.fetchGuilds();
        });

        this.fetchGuilds();
    },
    watch: {
    },
    methods: {
        fetchGuilds() {
            this.socket.emit(
                'guilds/all',
                { id: null },
                response => {
                    if (response.error) {
                        console.log(response.error);
                    }
                    this.guilds = response.data;
                }
            );
        },
    },
};

export default component;