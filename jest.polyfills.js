// jest.polyfills.js
// Only polyfill in jsdom when Node globals are missing.
// Never overwrite Node's real process/Buffer that Jest depends on.

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = require('buffer/').Buffer;
}

if (
  typeof globalThis.process === 'undefined' ||
  !globalThis.process.versions || // not a real Node process
  !globalThis.process.versions.node
) {
  globalThis.process = require('process/browser');
}

// Some libs expect `global` to exist
if (!globalThis.global) globalThis.global = globalThis;

