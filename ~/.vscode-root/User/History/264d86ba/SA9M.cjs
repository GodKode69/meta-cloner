#!/usr/bin/env node
const { spawn } = require('child_process');
const { join } = require('path');
const { pathToFileURL } = require('url');

const indexURL = pathToFileURL(join(__dirname, 'index.mjs')).href;
const code = `import("${indexURL}")`;

// Spawn a new Node process using shell mode.
const child = spawn(`${process.execPath} --eval "${code}"`, {
  shell: true,
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code);
});
