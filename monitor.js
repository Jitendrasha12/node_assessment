
const { spawn } = require('child_process');
const pidusage = require('pidusage');

let serverProcess = null;

function startServer() {
  console.log('Starting server (app.js)...');
  serverProcess = spawn('node', ['app.js'], { stdio: 'inherit' });
  serverProcess.on('exit', (code) => {
    console.log('Server process exited with', code);
  });
}

async function checkCPU() {
  if (!serverProcess || serverProcess.killed) return;
  try {
    const stats = await pidusage(serverProcess.pid);
    // stats.cpu is percentage (0-100)
    console.log(`PID ${serverProcess.pid} CPU: ${stats.cpu.toFixed(2)}% | Memory: ${(stats.memory / 1024 / 1024).toFixed(2)}MB`);
    if (stats.cpu > 70) {
      console.log('⚠️ CPU over 70% - restarting server...');
      serverProcess.kill('SIGTERM');
      // give some time then restart
      setTimeout(startServer, 2000);
    }
  } catch (err) {
    console.error('pidusage error', err.message);
  }
}

// start app
startServer();
// check every 5 seconds
setInterval(checkCPU, 5000);
