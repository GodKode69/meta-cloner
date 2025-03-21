#!/usr/bin/env node
const { spawn } = require('child_process');
const { join } = require('path');
const { pathToFileURL } = require('url');

// Compute absolute file URL for index.mjs
const indexURL = pathToFileURL(join(__dirname, 'index.mjs')).href;

// Build a Node command that dynamically imports the module.
const code = `import("${indexURL}");`;

// Spawn a new Node process with the --eval flag.
const child = spawn(process.execPath, ['--eval', code], {
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code);
});
