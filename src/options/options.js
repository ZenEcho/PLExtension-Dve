import 'virtual:uno.css'
import '../assets/css/main.css'
import { createApp } from 'vue'

import Options from '../options/options.vue'

const options = createApp(Options)

options.mount('#app');