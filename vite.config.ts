import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});

/*
# localhost

VITE_LOCAL_HOST="localhost:8000"

# remote host

VITE_REMOTE_HOST="tolbel-express-server-production.up.railway.app"
*/
