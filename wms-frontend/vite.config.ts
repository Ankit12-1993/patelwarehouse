import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to reject any request that isn't from the patelwarehouse.in domain
const hostEnforcerPlugin = () => ({
  name: 'host-enforcer',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const host = req.headers.host || '';
      if (!host.includes('patelwarehouse.in')) {
        res.statusCode = 403;
        res.end('Access Denied. Please use http://patelwarehouse.in to access the platform.');
        return;
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), hostEnforcerPlugin()],
  server: {
    host: '127.0.0.1',
    allowedHosts: ['patelwarehouse.in']
  }
})
