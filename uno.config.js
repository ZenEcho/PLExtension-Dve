// uno.config.ts
import { defineConfig } from 'unocss'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  important: true,
  presets: [
    presetIcons({ /* options */ }),
    // ...other presets
  ],

})