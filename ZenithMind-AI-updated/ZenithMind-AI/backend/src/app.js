import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './config/db.js';
import routes from './routes/index.js';
import { log } from './utils/logger.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const port = process.env.PORT || 8080;

app.listen(port, async () => {
  await pool.query('SELECT 1');
  log(`Backend running on http://localhost:${port}`);
});
