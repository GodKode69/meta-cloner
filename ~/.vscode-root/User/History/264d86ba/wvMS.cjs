#!/usr/bin/env node
const { join } = require('path');
const { pathToFileURL } = require('url');

(async () => {
  // Compute the absolute file URL for index.mjs
  const mainPath = pathToFileURL(join(__dirname, 'index.mjs')).href;
  await import(mainPath);
})();
