
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  const apiKey = process.env.API_KEY || env.API_KEY;

  // Filtra variáveis do Firebase para garantir que sejam passadas
  const firebaseVars = Object.keys(env).reduce((prev, next) => {
    if (next.startsWith('VITE_FIREBASE_')) {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
    }
    return prev;
  }, {} as any);

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
      ...firebaseVars
    },
  };
});
