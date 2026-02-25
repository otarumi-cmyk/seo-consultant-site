const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルを配信
app.use(express.static(path.join(__dirname)));

// SPA ではないが、念のためルートは index.html にフォールバック
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  // Railwayのログでポート確認用
  console.log(`Server running on port ${PORT}`);
});

