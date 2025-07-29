// server.js (En Sağlam ve Esnek Versiyon)

import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 8080;

// Sunucu dosyasının tam yolunu bul
const currentDir = dirname(fileURLToPath(import.meta.url));

// 'dist' klasörünün tam yolunu oluştur
const distDir = join(currentDir, 'dist');

// Derlenmiş 'dist' klasörünü statik olarak sun
app.use(express.static(distDir));

// Diğer tüm istekleri 'dist' içindeki 'index.html'e yönlendir
// Bu, Vue Router'ın çalışması için gereklidir
app.get('*', (req, res) => {
  res.sendFile(join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});