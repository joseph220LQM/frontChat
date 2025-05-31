import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // no agregues configuración postcss aquí a menos que sepas lo que haces
})

