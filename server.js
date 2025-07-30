import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(express.json());

// Endpoint to read a file
app.get('/api/load-log', (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ error: 'Missing file path' });

  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    res.send(content);
  } catch (err) {
    res.status(500).json({ error: `Could not read file: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
