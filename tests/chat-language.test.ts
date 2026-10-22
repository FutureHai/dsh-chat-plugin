import { runInNewContext } from 'node:vm'
import { expect, it } from 'vitest'
import { chatLanguageForHarness, initialLanguageScript } from '../src/client/chatLanguage.ts'

const key = '__appKit_@deepseek/chat_localePreference'

function runLanguageScript(language: 'zh_CN' | 'en_US', initial: string | null, pageLanguage: string) {
  const storage = new Map<string, string>()
  if (initial !== null) storage.set(key, initial)
  storage.set('userToken', 'unchanged-test-value')
  const writes: string[] = []
  const localStorage = {
    getItem: (name: string) => storage.get(name) ?? null,
    setItem: (name: string, value: string) => { writes.push(name); storage.set(name, value) },
  }
  const changed = runInNewContext(initialLanguageScript(language), {
    localStorage, document: { documentElement: { lang: pageLanguage } },
  }) as boolean
  return { changed, preference: storage.get(key), writes, token: storage.get('userToken') }
}

it('maps the active Harness language to a supported Chat language', () => {
  expect(chatLanguageForHarness('zh')).toBe('zh_CN')
  expect(chatLanguageForHarness('zh-CN')).toBe('zh_CN')
  expect(chatLanguageForHarness('en')).toBe('en_US')
  expect(chatLanguageForHarness('fr')).toBe('en_US')
})

it('sets only the default Chat language and requests a reload when needed', () => {
  const result = runLanguageScript('zh_CN', null, 'en')
  expect(result.changed).toBe(true)
  expect(JSON.parse(result.preference!)).toEqual({ value: 'zh_CN', __version: '0' })
  expect(result.writes).toEqual([key])
  expect(result.token).toBe('unchanged-test-value')
})

it('keeps a website language explicitly selected by the user', () => {
  const previous = JSON.stringify({ value: 'en_US', __version: '0' })
  const result = runLanguageScript('zh_CN', previous, 'en')
  expect(result.changed).toBe(false)
  expect(result.preference).toBe(previous)
  expect(result.writes).toEqual([])
})

it('replaces the website system default without reloading an already matching page', () => {
  const result = runLanguageScript('zh_CN', JSON.stringify({ value: 'system', __version: '0' }), 'zh-CN')
  expect(result.changed).toBe(false)
  expect(JSON.parse(result.preference!)).toEqual({ value: 'zh_CN', __version: '0' })
})
