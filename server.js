import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Handle specific scanner routes FIRST (before static middleware)
app.get('/scanner/scan_mind', (req, res) => {
  console.log('Serving scan_mind without .html extension');
  res.setHeader('Permissions-Policy', 'camera=*, microphone=*, geolocation=*');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(__dirname, 'public/scanner/scan_mind.html'));
});

app.get('/scanner/scan_mind.html', (req, res) => {
  console.log('Serving scan_mind.html');
  res.setHeader('Permissions-Policy', 'camera=*, microphone=*, geolocation=*');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(__dirname, 'public/scanner/scan_mind.html'));
});

// Serve scanner static files (videos, markers, etc.)
app.use('/scanner', express.static(path.join(__dirname, 'public/scanner'), {
  setHeaders: (res, path) => {
    res.setHeader('Permissions-Policy', 'camera=*, microphone=*, geolocation=*');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Set proper MIME types for main app
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Permissions-Policy', 'camera=*, microphone=*, geolocation=*');
  }
}));

// Handle client-side routing for React app (catch-all)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
