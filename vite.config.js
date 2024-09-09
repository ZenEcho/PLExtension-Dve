import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import { presetWind, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  server: {
    open: '/popup.html'
  },
  plugins: [
    vue(),
    vueJsx(),
    Unocss({
      presets: [
        presetWind(),  // 这个是可选的
        presetIcons(), // 确保已经启用了 Icons 预设
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 在这里设置资产文件命名策略
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: (chunkInfo) => {
          const contentFiles = ['content', 'getAPI', 'notification'];
          if (chunkInfo.name === 'background') {
            return '[name].js';
          }
          if (contentFiles.includes(chunkInfo.name)) {
            return `static/content/${chunkInfo.name === 'notification' ? 'notification/' : ''}[name].js`;
          }
          return 'static/js/[name]-[hash].js';
        },
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      },
      input: {
        popup: resolve(__dirname, 'popup.html'),
        options: resolve(__dirname, 'options.html'),
        uplaodLog: resolve(__dirname, 'uplaodlog.html'),
        background: resolve(__dirname, 'src/background/background.js'),
        content: resolve(__dirname, 'src/content/content.js'),
        getAPI: resolve(__dirname, 'src/content/getAPI.js'),
        notification: resolve(__dirname, 'src/content/notification/notification.js') // 添加 notification 文件路径
      },
    }
  }
})