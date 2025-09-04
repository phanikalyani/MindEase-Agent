import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import googleCalendarRoutes from './routes/googleCalendar.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/google', googleCalendarRoutes);

app.get('/', (req, res) => {
  res.send('ZenithMind AI Backend is Running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));