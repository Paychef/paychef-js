// Markiert den CJS-Build-Ordner als CommonJS (das Root-Paket ist "type": "module").
import { writeFileSync, mkdirSync } from 'node:fs';

mkdirSync(new URL('../dist/cjs', import.meta.url), { recursive: true });
writeFileSync(
  new URL('../dist/cjs/package.json', import.meta.url),
  JSON.stringify({ type: 'commonjs' }, null, 2) + '\n',
);
console.log('dist/cjs/package.json written');
