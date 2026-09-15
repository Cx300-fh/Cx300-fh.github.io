import { readFile, writeFile, rm, readdir, mkdir, rename } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const output = fileURLToPath(new URL('../dist/client/', import.meta.url));
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(resolve(directory, entry.name)) : resolve(directory, entry.name)))).flat();
}
// Vinext exports clean routes as .html files. GitHub Pages needs a directory
// index for trailing-slash URLs; normalize before computing asset prefixes.
for (const file of (await walk(output)).filter(file => file.endsWith('.html'))) {
  if (['index.html','404.html'].includes(relative(output, file))) continue;
  const destination = resolve(file.slice(0, -5), 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await rename(file, destination);
}
const files = await walk(output);
let count = 0;
for (const file of files.filter(file => file.endsWith('.html'))) {
  const folder = relative(output, dirname(file));
  const prefix = folder ? '../'.repeat(folder.split(sep).length) : './';
  let html = await readFile(file, 'utf8');
  // Server-rendered pages use standard links and progressive enhancement.
  // Relative URLs keep every route portable across user and project Pages.
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<link\b[^>]*>/gi, tag => /rel="modulepreload"|as="script"/.test(tag) ? '' : tag);
  html = html.replace(/\b(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, value) => `${attr}="${prefix}${value}"`);
  html = html.replace('</body>', `<script src="${prefix}interactions.js" defer></script></body>`);
  await writeFile(file, html);
  count++;
}
for (const file of files.filter(file => file.endsWith('.rsc'))) await rm(file, { force: true });
await rm(resolve(output, '_next/static/chunks'), { recursive: true, force: true });
await rm(resolve(output, '.vite'), { recursive: true, force: true });
await rm(resolve(output, 'vinext-client-entry-manifest.json'), { force: true });
await writeFile(resolve(output, '.nojekyll'), '');
console.log(`Portable static export ready: ${count} HTML pages in dist/client`);
