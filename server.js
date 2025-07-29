// server.js (Modern ES Module Syntax)

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 8080;

// ES Modüllerinde __dirname'i bu şekilde alırız
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Derlenmiş 'dist' klasörünü sun
app.use(express.static(path.join(__dirname, 'dist')));

// Tüm istekleri index.html'e yönlendir (Vue Router'ın çalışması için)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});