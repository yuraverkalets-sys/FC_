const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Disable fingerprinting header
app.disable('x-powered-by');

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "script-src 'self' https://cdnjs.cloudflare.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  );
  next();
});

// Serve static files from /public with cache control
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    etag: true,
    lastModified: true
  })
);

// Serve index.html on GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Not found');
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

app.listen(PORT, () => {
  console.log(`Fivecube server running at http://localhost:${PORT}`);
});
