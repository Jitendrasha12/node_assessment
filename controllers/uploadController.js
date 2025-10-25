const { Worker } = require('worker_threads');
const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = req.file.path;
    const worker = new Worker(path.resolve(__dirname, '../worker/parseWorker.js'), {
      workerData: {
        filePath,
        mongoUri: process.env.MONGODB_URI
      }
    });

    worker.on('message', (msg) => {
      console.log('Worker message', msg);
    });

    worker.on('error', (err) => {
      console.error('Worker error', err);
    });

    worker.on('exit', (code) => {
      console.log('Worker exited with', code);
    });

    res.json({ message: 'File upload accepted. Worker started to import data.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
