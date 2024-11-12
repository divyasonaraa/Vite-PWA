import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
        VitePWA({
        manifest: {
            name: "User List",
            short_name: "users",
            description: "Simple app to view user list.",
            icons: [
                {
                     src: '/icons/icon-512x512.png',
                     sizes: '512x512',
                     type: 'image/png'
                }
            ]
        },
        devOptions: {
            enabled: true
        },
        workbox: {
         globPatterns: ["**/*.{js,css,html,pdf}"],
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/jsonplaceholder\.typicode\.com\/users/,
                handler: "CacheFirst" as const,
                options: {
                    cacheName: "api-cache",
                    cacheableResponse: {
                        statuses: [0, 200]
                        },
                }
            }
        ]
        },
        registerType: 'autoUpdate'
    }),
  ],
  build: {
    outDir: './dist/',
    emptyOutDir: true
  },
  server: {
    port: 8888
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
