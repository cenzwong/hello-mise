import { pathToFileURL } from 'node:url';

export function greet(name = 'World') {
  return `Hello, ${name}! (Node.js)`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(greet(process.env.HELLO_NAME ?? 'World'));
}
