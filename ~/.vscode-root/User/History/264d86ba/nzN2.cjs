#!/usr/bin/env node
const { spawn } = require('child_process');
const { join } = require('path');
const { pathToFileURL } = require('url');

// Compute the absolute file URL for index.mjs.
const indexURL = pathToFileURL(join(__dirname, 'index.mjs')).href;

// Build the code string that dynamically imports your ESM entry.
const code = `import("${indexURL}")`;

// Spawn a new Node process using array arguments (no shell)
const child = spawn(process.execPath, ['--eval', code], {
  stdio: 'inherit',
  shell: false
});

child.on('exit', (code) => {
  process.exit(code);
});
