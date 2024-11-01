import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000', // Rails Server
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });


export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: command === 'serve' ? 'http://localhost:3000' : 'https://flyaway-rails-react.fly.dev',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
