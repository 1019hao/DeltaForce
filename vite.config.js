import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/DeltaForce/',   // 仓库名大小写必须一致
  build: { outDir: 'docs' }
})
