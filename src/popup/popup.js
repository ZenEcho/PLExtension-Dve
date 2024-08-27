import 'virtual:uno.css'
import '../assets/css/main.css'
import { createApp } from 'vue'

import Popup from '../popup/popup.vue'
const popup = createApp(Popup)
popup.mount('#app');