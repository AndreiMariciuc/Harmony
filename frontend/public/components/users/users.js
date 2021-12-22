import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('users');

import friends from '../friends/friends.js';
import findFriends from '../find-friends/find-friends.js';
import guilds from '../guilds/guilds.js';

const component = {
	template: template,
	props: ['socket', 'conversation'],
	components: {
		'tab-personal': friends,
		'tab-global': findFriends,
		'tab-guilds': guilds,
	},
	data() {
		return {
			tabs: ['Personal', 'Global', 'Guilds'],
			currentTab: 'Personal',
		};
	},
	mounted() {},
	computed: {
		currentTabComponent() {
			return 'tab-' + this.currentTab.toLowerCase();
		},
	},
	methods: {},
};

export default component;
