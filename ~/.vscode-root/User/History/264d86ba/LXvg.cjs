#!/usr/bin/env node
const { spawn } = require('child_process');
const { join } = require('path');

const esmPath = join(__dirname, 'index.mjs');

// Spawn a new Node process to run the ESM entry point.
const child = spawn(process.execPath, [esmPath], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code);
});
