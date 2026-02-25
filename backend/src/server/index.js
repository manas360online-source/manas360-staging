import 'dotenv/config';
import express from 'express';
import themedRoomsRouter from './routes/themedRooms.js';

const app = express();

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/themed-rooms', themedRoomsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal server error.' });
});

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
