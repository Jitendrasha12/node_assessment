// app.js
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./utils/db');
const uploadRoutes = require('./routes/upload');
const policyRoutes = require('./routes/policy');
const scheduleRoutes = require('./routes/schedule');
const scheduleController = require('./controllers/scheduleController');

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/node_assessment');

  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => res.send('Node Assessment API is running'));

  app.use('/api', uploadRoutes);
  app.use('/api/policies', policyRoutes);
  app.use('/api/schedule', scheduleRoutes);

  // load scheduled jobs from DB on start
  scheduleController.loadAndScheduleAll().catch(console.error);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
