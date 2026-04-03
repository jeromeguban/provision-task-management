import { defineConfig, type Plugin } from 'vite'
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
    tailwindcss(),
    ...tanstackStart({
      customViteReactPlugin: true,
      tsr: {
        srcDirectory: 'src',
      },
      target: 'vercel',
    }),
  ],
})
