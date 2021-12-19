import createTemplate from '../../js/createTemplate.js';

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
		handleImageUpload(event) {
			const currImage = event.target.files[0];
			this.image = currImage;
			this.$emit('image-uploaded', currImage);
		},
		deleteImage() {
			this.$emit('delete-image');
		},
	},
};

export default component;
