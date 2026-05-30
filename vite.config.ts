import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";
import path from 'path';

// Group heavy third-party libs into stable, cacheable vendor chunks (client build only).
function manualChunks(id: string) {
  if (!id.includes('node_modules')) return;
  if (/[\\/]node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/.test(id))
    return 'react-vendor';
  if (id.includes('@mui/x-data-grid')) return 'mui-datagrid';
  if (id.includes('@mui')) return 'mui-material';
  if (id.includes('@emotion')) return 'emotion';
  if (
    id.includes('recharts') ||
    id.includes('victory-vendor') ||
    id.includes('d3-') ||
    id.includes('internmap')
  )
    return 'charts';
  if (id.includes('gantt-task-react')) return 'gantt';
  if (id.includes('react-dnd') || id.includes('dnd-core')) return 'dnd';
  if (id.includes('@tanstack')) return 'tanstack';
  return 'vendor';
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      "@/shared": path.resolve(__dirname, "./shared"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  environments: {
    client: {
      build: {
        // @mui/x-data-grid is a single ~680 kB lib (isolated in its own chunk below);
        // raise the limit so the build stays clean while still catching new bloat.
        chunkSizeWarningLimit: 800,
        rollupOptions: {
          output: { manualChunks },
        },
      },
    },
  },
})
