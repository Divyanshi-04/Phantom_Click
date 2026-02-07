const { spawn } = require('child_process');
const path = require('path');

/*
========================================================
AIRLOCK EXECUTION MODE SWITCH

DEV  (fast, no Docker, recommended while coding):
npm run dev

PROD (secure, runs inside Docker sandbox):
USE_DOCKER=true npm run dev

Docker image must be built first:
docker build -t airlock-worker .

========================================================
*/

const USE_DOCKER = process.env.USE_DOCKER === 'true';

function runAirlock(url) {
  return new Promise((resolve, reject) => {

    let command;
    let args;

    if (USE_DOCKER) {
      console.log('🐳 Running in Docker (secure sandbox)');

      // Production-safe container execution
      command = 'docker';
      args = [
        'run',
        '--rm', // auto delete container after run
        '--memory=512m', // prevent memory abuse
        '--cpus=1.0', // limit CPU usage
        '--pids-limit=100', // prevent fork bombs
        '--read-only', // filesystem protection
        '--tmpfs', '/tmp:rw,noexec,nosuid,size=100m', // temp only writable
        '--cap-drop=ALL', // drop privileges
        'airlock-worker',
        url
      ];

    } else {
      console.log('⚡ Running locally (dev mode, faster)');

      // Local execution for development (no rebuild needed)
      command = 'node';
      args = [
        path.resolve(__dirname, '../playwright-worker/analyze.js'),
        url
      ];
    }

    const child = spawn(command, args);

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', d => output += d.toString());
    child.stderr.on('data', d => errorOutput += d.toString());

    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(errorOutput));
      }

      try {
        resolve(JSON.parse(output));
      } catch {
        reject(new Error('Invalid JSON from worker'));
      }
    });
  });
}

module.exports = { runAirlock };
