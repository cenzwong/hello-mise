import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { greet } from '../hello.mjs';

test('default name', () => {
  assert.equal(greet(), 'Hello, World! (Node.js)');
});

test('custom name', () => {
  assert.equal(greet('London'), 'Hello, London! (Node.js)');
});

test('CLI reads environment', () => {
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('../hello.mjs', import.meta.url))], {
    env: { ...process.env, HELLO_NAME: 'London' },
    encoding: 'utf8',
  });
  assert.equal(output.trim(), 'Hello, London! (Node.js)');
});
