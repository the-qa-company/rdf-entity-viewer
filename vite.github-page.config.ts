import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker'
import eslint from 'vite-plugin-eslint'
import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fs from 'fs'

const noJekyll = (): PluginOption => {
  let outDir: string
  return {
    name: 'no-jekyll',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    writeBundle() {
      fs.writeFileSync(path.join(outDir, '.nojekyll'), '')
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    checker({ typescript: true }),
    eslint(),
    nodeResolve(),
    noJekyll()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist-github-page'
  },
})
