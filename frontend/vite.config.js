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
        chunkSizeWarningLimit: 1000, // avoid unnecessary warnings

        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    tiptap: [
                        '@tiptap/core',
                        '@tiptap/react',
                        '@tiptap/starter-kit'
                    ],
                },
            },
        },

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