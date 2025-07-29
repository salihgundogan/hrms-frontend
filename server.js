// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Derlenmiş 'dist' klasörünü sun
app.use(express.static(path.join(__dirname, 'dist')));

// Tüm istekleri index.html'e yönlendir (Vue Router'ın çalışması için)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});