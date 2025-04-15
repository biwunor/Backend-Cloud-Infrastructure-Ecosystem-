import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer as createViteServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

async function createServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    base: '/'
  });

  app.use(vite.middlewares);
  
  app.use('*', async (req, res, next) => {
    try {
      // Serve the index.html
      let template = join(__dirname, 'client', 'index.html');
      template = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

createServer();