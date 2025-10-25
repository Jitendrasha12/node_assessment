// controllers/scheduleController.js
const ScheduledMessage = require('../models/ScheduledMessage');
const schedule = require('node-schedule');

const jobs = new Map();

function scheduleJob(doc) {
  const runDate = new Date(doc.runAt);
  if (runDate <= new Date()) return; // ignore past
  const job = schedule.scheduleJob(runDate, async function () {
    try {
      await ScheduledMessage.findByIdAndUpdate(doc._id, { executed: true });
    } catch (err) {
      console.error('job error', err);
    }
  });
  jobs.set(String(doc._id), job);
}

exports.createScheduledMessage = async (req, res) => {
  try {
    const { message, day, time } = req.body;
    if (!message || !day || !time) return res.status(400).json({ error: "message, day and time required" });
    const runAt = new Date(`${day}T${time}:00`);
    const doc = await ScheduledMessage.create({ message, runAt });
    scheduleJob(doc);
    res.json({ message: 'Scheduled', doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loadAndScheduleAll = async () => {
  const pending = await ScheduledMessage.find({ executed: false, runAt: { $gt: new Date() } });
  pending.forEach(scheduleJob);
};
