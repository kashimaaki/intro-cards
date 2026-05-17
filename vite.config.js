import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ★ リポジトリ名に合わせて変更してください
const REPO_NAME = 'intro-cards'

export default defineConfig({
  plugins: [react()],
  base: `/${REPO_NAME}/`,
})
