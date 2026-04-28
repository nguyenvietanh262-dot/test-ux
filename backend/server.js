require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const communityRoutes = require('./routes/community');
const achievementRoutes = require('./routes/achievements');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/achievements', achievementRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Humai Tasks API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
