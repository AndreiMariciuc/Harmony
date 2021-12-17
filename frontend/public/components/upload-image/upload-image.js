import createTemplate from '../../js/createTemplate.js';

const template = await createTemplate('upload-image');


const component = {
    template: template
    , data() {
        return {
            image: null,
        }
    },
    unmounted() {
        this.image = null;
    },
    computed: {
        generatePreview() {
            if(this.image === null) return ""

            return window.URL.createObjectURL(this.image);
        }
    },
    methods: {
        handleImageUpload(event) {
            const currImage = event.target.files[0];
            this.image = currImage;
            this.$emit("image-uploaded", currImage);
        }
    },
};

export default component;