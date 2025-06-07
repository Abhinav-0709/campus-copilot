import { defineConfig, loadEnv, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { IncomingMessage, ServerResponse } from 'http';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env': {
        OLLAMA_BASE_URL: JSON.stringify(env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434'),
        CHROMA_DB_URL: JSON.stringify(env.VITE_CHROMA_DB_URL || 'http://localhost:8000'),
        OLLAMA_MODEL: JSON.stringify(env.VITE_OLLAMA_MODEL || 'llama3.2')
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 5173,
      open: true,
      // Add custom middleware
      setupMiddlewares: (middlewares: any[], { middlewares: use }: { middlewares: (req: IncomingMessage, res: ServerResponse, next: () => void) => void }) => {
        // Add a custom route to handle campus data import
        use('/api/import-campus-data', async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          try {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            // Get the absolute path to the data file
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const dataPath = resolve(__dirname, '..', 'data', 'campus_data.json');
            
            // Import the campus data importer
            const { importCampusData } = await import('../src/services/campusDataImporter');
            
            // Import the data
            const result = await importCampusData(dataPath);
            
            // Send the response
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = result.success ? 200 : 500;
            res.end(JSON.stringify(result));
          } catch (error) {
            console.error('Error in import-campus-data endpoint:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              message: error instanceof Error ? error.message : 'Internal server error'
            }));
          }
        });
        
        return middlewares;
      },
      proxy: {
        // Proxy API requests to the backend server
        '/api/ai': {
          target: 'http://localhost:11434',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ai/, '')
        },
        // Keep existing proxies
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/v2': {
          target: 'http://localhost:8000',
          changeOrigin: true
        }
      }
    }
  };
});
