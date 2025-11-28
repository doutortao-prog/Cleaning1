import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo atual.
  // O terceiro argumento '' permite carregar todas as variáveis, não apenas as que começam com VITE_
  const env = loadEnv(mode, process.cwd(), '');

  // Tenta pegar do process.env (Node/Vercel System) ou do env carregado pelo Vite
  const apiKey = process.env.API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Injeta a variável globalmente no código compilado
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});