import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker'
import eslint from 'vite-plugin-eslint'
import dns from 'dns'
import dts from 'vite-plugin-dts'
import path, { resolve } from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fs from 'fs'

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

function autoExternals (): PluginOption {
  return {
    name: 'auto-externals',
    apply: 'build',
    enforce: 'pre',
    config(config) {
      const packageFile = JSON.parse((fs.readFileSync(resolve(config.root ?? './', 'package.json')).toString()))
      const deps = [
        ...Object.keys(packageFile.dependencies || {}),
        ...Object.keys(packageFile.peerDependencies || {}),
        ...Object.keys(packageFile.devDependencies || {}),
      ]
      const prevExternal = config.build?.rollupOptions?.external
      config.build = config.build || {}
      config.build.rollupOptions = config.build.rollupOptions || {}
      config.build.rollupOptions.external = (...args) => {
        const source = args[0]
        if (typeof prevExternal === 'function' && prevExternal(...args)) return true
        if (Array.isArray(prevExternal)) {
          for (const x of prevExternal) {
            if (typeof x === 'string' && x === source) return true
            if (x instanceof RegExp && x.test(source)) return true
          }
        }
        return deps.some(dep => source === dep || source.startsWith(`${dep}/`))
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    checker({ typescript: true }),
    eslint(),
    dts({ insertTypesEntry: true }),
    autoExternals(),
    removePublicFolderFromBuild(),
    nodeResolve()
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
