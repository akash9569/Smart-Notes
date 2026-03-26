import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            // 🔥 Fix for react-router resolution issue (important)
            'react-router': 'react-router-dom',
        },
    },

    server: {
        port: 5175,
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            },
        },
    },
})