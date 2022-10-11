import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import tsconfigPaths from 'vite-tsconfig-paths'
import dns from 'dns'
import dts from 'vite-plugin-dts'
import path, { resolve } from 'path'
import autoExternal from 'rollup-plugin-auto-external'

// Used to make Vite use localhost instead of 127.0.0.1
dns.setDefaultResultOrder('verbatim')

// Act as if the public folder was empty at build time (not during dev)
function removePublicFolderFromBuild (): PluginOption {
  return {
    name: 'remove-public-folder',
    apply: 'build',
    enforce: 'pre',
    config(config) {
      config.publicDir = false
      return config
    },      
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    eslint(),
    dts({ insertTypesEntry: true }),
    removePublicFolderFromBuild(),
    autoExternal({ builtins: true, dependencies: true, devDependencies: true, peerDependencies: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/RdfEntityViewer.tsx'),
      name: 'RdfEntityViewer',
      formats: ['es', 'umd']
    }
  },
})
