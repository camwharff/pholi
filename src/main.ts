import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import router from '@/router'
// @ts-ignore
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

import 'vue-plyr/dist/vue-plyr.css'

createApp(App)
    .use(VuePlyr, {
        plyr: {
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen']
        }
    })
    .use(router)
    .mount('#app')
