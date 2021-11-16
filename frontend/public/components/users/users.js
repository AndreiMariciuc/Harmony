import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('users');

import friends from '../friends/friends.js';
import findFriends from '../find-friends/find-friends.js';

const component = {
	template: template,
    props: ['socket'],
    components: {
        'tab-personal' : friends,
        'tab-global': findFriends
    },
    data() {
        return {
            tabs: ['Personal', 'Global'],
            currentTab: 'Personal',
        };
    },
    mounted() {
    },
    computed: {
        currentTabComponent() {
            return 'tab-' + this.currentTab.toLowerCase();
        }
    },
    methods: {
        test() {
            console.log('caca');
        }
    },
};

export default component;