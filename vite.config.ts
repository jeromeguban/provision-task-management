import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'

const patchTssProcessEnv: Plugin = {
  name: 'patch-tss-process-env',
  transform(code, id) {
    if (id.includes('start-server-functions-client')) {
      return code.replace('process.env.TSS_APP_BASE', '""')
    }
  },
}

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    patchTssProcessEnv,
    ...tanstackStart({
      srcDirectory: 'src',
      server: {
        preset: process.env.VERCEL ? 'vercel' : 'node',
      },
    }),
    tailwindcss(),
    react(),
  ],
})
