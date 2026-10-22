import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

const root = new URL('../', import.meta.url)
const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))

test('the package is an installable standalone Harness bundle', () => {
  assert.equal(manifest.name, 'dsh-chat-plugin')
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(manifest.dsh.client.platform, 'web')
  const patch = readFileSync(new URL('cordis.patch.yml', root), 'utf8')
  assert.match(patch, /name: dsh-chat-plugin/)
  assert.doesNotMatch(patch, /@deepseek-ai\/dsh-client-ui-deepseek-chat/)
  assert.match(readFileSync(new URL('lib/index.js', root), 'utf8'), /function apply\(\)/)
})

test('the built client registers under the new package name', () => {
  const code = readFileSync(new URL('lib/client.js', root), 'utf8')
  let registered
  runInNewContext(code, { URL, window: { __ModuleLoader__: { load: entry => { registered = entry } } } })
  assert.equal(registered.id, manifest.name)
  assert.equal(typeof registered.factory, 'function')
  const client = registered.factory(() => ({}))
  assert.equal(typeof client.apply, 'function')
  assert.deepEqual([...client.inject], ['slots', 'locale', 'layout'])
})
