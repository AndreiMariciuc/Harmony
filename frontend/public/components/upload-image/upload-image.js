import createTemplate from '../../js/createTemplate.js';
import config from '../../config/config.js';

const template = await createTemplate('upload-image');

const component = {
	template: template,
	props: ['image'],
	data() {
		return {};
	},
	unmounted() {},
	computed: {
		generatePreview() {
			if (this.image === null) return '';
			return window.URL.createObjectURL(this.image);
		},
	},
	methods: {
		deleteImage() {
			this.$emit('delete-image');
		},
		isImage(name) {
			if (name == null) return false;
			const ext = name.split('.').pop().toLowerCase();
			return config.imgs.includes(ext);
		},
		updateImage(event) {
			// console.log(event);
			event.target.style.width = 'auto';
			event.target.style.height = 'auto';
		},
	},
};

export default component;
