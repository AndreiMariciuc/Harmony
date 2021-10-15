const app = Vue.createApp({
    data() {
        return {
            component: 'first'
        }
    },
    methods: {
        handleChangeComponent(component) {
            this.component = component;
        }
    },
    computed: {
        currentComponent() {
            return `${this.component}-component`;
        }
    }
});

app.component('first-component', {
    template: `<h1>Hello World!</h1>
              <button @click="changeComponent">Schimba!</button>`,
    emits: ['change-component'],
    methods: {
        changeComponent() {
            this.$emit('change-component', 'changed');
        }
    }
});

app.component('changed-component', {
    template: ` <h1>Salut, Andrei</h1>
                <p>Esti un animal paros?</p>
                <div>
                  <input type="radio" id="da" name="raspuns" value="Da">
                  <label for="da">Da</label>
                </div>
                <div>
                  <input type="radio" id="nu" name="raspuns" value="Nu">
                  <label for="nu">Nu</label>
                </div>
                <button>Nu face nimic</button>`,
    emits: ['change-component'],
});

app.mount('#app');

console.log('yay merge');