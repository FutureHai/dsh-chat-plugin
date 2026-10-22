// @vitest-environment jsdom
import { Context } from '@deepseek-ai/cordis'
import { afterEach, expect, it, vi } from 'vitest'
import { apply, inject } from '../src/client/index.ts'

vi.mock('@deepseek-ai/dsh-client-ui-primitives', () => ({
  Button: () => null,
  Modal: () => null,
  IconNewChatOutlineRegular: () => null,
}))

const contexts: Context[] = []

afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => ctx.fiber.dispose()))
  vi.unstubAllGlobals()
})

async function boot() {
  const ctx = new Context()
  contexts.push(ctx)
  const entries: { options: Record<string, unknown>; component: unknown }[] = []
  const dictionaries = new Map<string, unknown>()
  let pluginContext: Context | undefined
  const slots = {
    inject: vi.fn((name: string, register: () => () => void) => pluginContext!.effect(register, name)),
    register: vi.fn((options: Record<string, unknown>, component: unknown) => {
      const entry = { options, component }
      entries.push(entry)
      return () => { entries.splice(entries.indexOf(entry), 1) }
    }),
  }
  const selectPanel = vi.fn()
  ctx.provide('slots', slots as never)
  ctx.provide('locale', {
    register: (name: string, dictionary: unknown) => {
      dictionaries.set(name, dictionary)
      return () => { dictionaries.delete(name) }
    },
    bind: () => (key: string) => key,
    getSnapshot: () => ({ active: 'zh', locales: [], revision: 0 }),
  } as never)
  ctx.provide('layout', { selectPanel } as never)
  const fiber = ctx.plugin({ inject: [...inject], apply(inner) { pluginContext = inner; apply(inner) } })
  await fiber.await()
  return { entries, dictionaries, selectPanel, fiber, slots }
}

it('registers no UI without the official Desktop Browser bridge', async () => {
  for (const carrier of [undefined, { protocolVersion: 2, browser: {} }, { protocolVersion: 1 }]) {
    vi.stubGlobal('dshDesktop', carrier)
    const harness = await boot()
    expect(harness.entries).toEqual([])
    expect(harness.dictionaries.size).toBe(0)
  }
})

it('registers a retained guest, main panel, and both navigation entries', async () => {
  const browser = { acquire: vi.fn(), release: vi.fn(), onOpenRequested: vi.fn() }
  vi.stubGlobal('dshDesktop', { protocolVersion: 1, browser })
  const harness = await boot()
  expect(harness.entries.map(({ options }) => [options.name, options.key ?? options.id])).toEqual([
    ['shell.overlay', 'deepseek-chat-guest'],
    ['main', 'deepseek-chat'],
    ['sidebar.panellist', 'deepseek-chat'],
    ['conversation.session.header.utilities', 'deepseek-chat'],
  ])
  const overlay = (harness.entries[0]?.options.inject as () => { bridge: unknown; session: unknown })()
  const panel = (harness.entries[1]?.options.inject as () => { session: unknown; back: () => void })()
  expect(overlay.bridge).toBe(browser)
  expect((overlay as typeof overlay & { getPreferredLanguage(): string }).getPreferredLanguage()).toBe('zh_CN')
  expect(panel.session).toBe(overlay.session)
  panel.back()
  expect(harness.selectPanel).toHaveBeenCalledExactlyOnceWith(null)
  const header = (harness.entries[3]?.options.inject as () => { open: () => void })()
  expect(harness.entries[3]?.options.order).toBe(5)
  header.open()
  expect(harness.selectPanel).toHaveBeenLastCalledWith('deepseek-chat')
  await harness.fiber.dispose()
  expect(harness.entries).toEqual([])
  expect(harness.dictionaries.size).toBe(0)
})
