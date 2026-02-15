import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pharaohs-blocks/', // Ensures assets are linked relatively, making it compatible with GitHub Pages repo paths
});