import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { transform } from 'lightningcss'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const output = join(root, 'lib')

const cssModules = {
  name: 'plugin-css-modules',
  setup(bundler) {
    bundler.onLoad({ filter: /\.module\.css$/ }, async ({ path }) => {
      const { code, exports: names } = transform({
        filename: relative(root, path).split(sep).join('/'),
        code: await readFile(path),
        cssModules: { pattern: '[hash]_[local]' },
        minify: true,
      })
      const classes = Object.fromEntries(Object.entries(names ?? {})
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => [key, value.name]))
      const tagId = `${manifest.name}/${basename(path)}`
      return {
        loader: 'js',
        contents: `const css = ${JSON.stringify(code.toString())};
const tagId = ${JSON.stringify(tagId)};
if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') === null) {
  const tag = document.createElement('style');
  tag.dataset.plugin = ${JSON.stringify(manifest.name)};
  tag.dataset.pluginCss = tagId;
  tag.textContent = css;
  document.head.appendChild(tag);
}
export default ${JSON.stringify(classes)};
`,
      }
    })
  },
}

await mkdir(output, { recursive: true })
await build({
  absWorkingDir: root,
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
})

const client = await build({
  absWorkingDir: root,
  entryPoints: ['src/client/index.ts'],
  outfile: 'lib/client.js',
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'cjs',
  target: 'es2022',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', '@deepseek-ai/dsh-client-ui-primitives'],
  plugins: [cssModules],
})
const code = client.outputFiles[0]?.text
if (code === undefined) throw new Error('Client bundle was not produced')
const body = code.replace(/^"use strict";\r?\n/, '')
await writeFile(join(output, 'client.js'), `window.__ModuleLoader__.load({
  id: ${JSON.stringify(manifest.name)},
  factory: (require) => {
    "use strict";
    var module = { exports: {} };
    var exports = module.exports;
${body}
    return module.exports;
  }
});
`)
