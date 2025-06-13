import { defineConfig, loadEnv, type ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': env.VITE_API_URL
      }
    }
  });
};
