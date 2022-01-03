import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('users');

import friends from '../friends/friends.js';
import findFriends from '../find-friends/find-friends.js';
import guilds from '../guilds/guilds.js';
import config from '../../config/config.js';

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
	methods: {
		logout() {
			// await fetch(`${config['frontend-addr']}/logout`, {
			// 	method: 'POST',
			// 	body: formData,
			// 	mode: 'cors',
			// 	headers: new Headers({
			// 		'Access-Control-Allow-Origin': '*',
			// 	}),
			// });
			window.location.href = `${config['frontend-addr']}/logout`;
		},
	},
};

export default component;
