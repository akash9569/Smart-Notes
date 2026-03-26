import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],

    resolve: {
        dedupe: ['react', 'react-dom'],
    },

    optimizeDeps: {
        include: ['react-router-dom'],
    },

    build: {
        commonjsOptions: {
            include: [/node_modules/],
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