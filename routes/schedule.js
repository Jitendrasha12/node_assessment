// routes/schedule.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.post('/schedule', scheduleController.createScheduledMessage);

module.exports = router;
