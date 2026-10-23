// @vitest-environment jsdom
/** A retained overlay keeps its guest while the main panel unmounts. */
import { afterEach, expect, it, vi } from 'vitest'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { BrowserChatOverlay, type BrowserChatOverlayProps } from '../src/client/BrowserChatOverlay.tsx'
import { BrowserChatSession } from '../src/client/BrowserChatSession.ts'
import { zh } from '../src/client/locales.ts'
import panelCss from '../src/client/ChatPanel.module.css'

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks() })

it('shares a fixed process-local account and retains the webview across Agent navigation', async () => {
  vi.stubGlobal('ResizeObserver', class { observe(): void {} unobserve(): void {} disconnect(): void {} })
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => { callback(0) }, 0))
  vi.stubGlobal('cancelAnimationFrame', (id: number) => { clearTimeout(id) })
  const release = vi.fn(async () => {})
  const bridge = {
    acquire: vi.fn(async () => ({ lease: 'lease-1', partition: 'dsh-sidebar-browser-test' })),
    release,
    onOpenRequested: vi.fn(() => () => {}),
  }
  const session = new BrowserChatSession()
  const props = { bridge, session, getPreferredLanguage: () => 'zh_CN',
    t: (key: keyof typeof zh) => zh[key] } as BrowserChatOverlayProps
  const view = render(<div><div><div data-deepseek-chat-seat /></div><BrowserChatOverlay {...props} /></div>)
  await waitFor(() => { expect(view.container.querySelector('webview')).not.toBeNull() })
  expect(bridge.acquire).toHaveBeenCalledExactlyOnceWith('deepseek-chat')
  const guest = view.container.querySelector('webview')!
  const loadURL = vi.fn(async () => {})
  const executeJavaScript = vi.fn(async () => false)
  const reload = vi.fn()
  Object.assign(guest, { getURL: () => 'about:blank#lease-1', loadURL, executeJavaScript, reload })
  guest.dispatchEvent(new Event('dom-ready'))
  expect(loadURL).toHaveBeenCalledExactlyOnceWith('https://chat.deepseek.com/')
  Object.assign(guest, { getURL: () => 'https://chat.deepseek.com/' })
  guest.dispatchEvent(new Event('did-stop-loading'))
  await waitFor(() => { expect(session.getSnapshot().phase).toBe('ready') })
  expect(executeJavaScript).toHaveBeenCalledOnce()
  const seat = view.container.querySelector('[data-deepseek-chat-seat]')!
  Object.defineProperty(seat, 'getBoundingClientRect', {
    value: () => ({ left: 8, top: 72, width: 540, height: 410 }),
  })
  view.container.style.gridTemplateColumns = '240px 1fr'
  await waitFor(() => {
    const host = view.container.querySelector('[data-deepseek-chat-guest]') as HTMLElement
    expect(host.style.top).toBe('72px')
    expect(host.style.height).toBe('410px')
  })
  const host = view.container.querySelector('[data-deepseek-chat-guest]') as HTMLElement
  const ownMenu = document.createElement('div')
  ownMenu.setAttribute('role', 'menu')
  ownMenu.className = panelCss.moreMenu as string
  document.body.append(ownMenu)
  const otherMenu = document.createElement('div')
  otherMenu.setAttribute('role', 'menu')
  document.body.append(otherMenu)
  await waitFor(() => { expect(host.style.visibility).toBe('hidden') })
  otherMenu.remove()
  await waitFor(() => { expect(host.style.visibility).toBe('visible') })
  ownMenu.remove()
  const chatSessionUrl = 'https://chat.deepseek.com/a/chat/s/example-session'
  Object.assign(guest, { getURL: () => chatSessionUrl })
  guest.dispatchEvent(Object.assign(new Event('did-navigate-in-page'), { isMainFrame: true }))
  guest.dispatchEvent(Object.assign(new Event('did-start-navigation'), {
    url: 'https://example.org/help', isMainFrame: true,
  }))
  expect(session.getSnapshot().outsideChat).toBe(true)
  Object.assign(guest, { getURL: () => 'https://example.org/help' })
  guest.dispatchEvent(new Event('did-stop-loading'))
  expect(session.getSnapshot().outsideChat).toBe(true)
  act(() => { session.returnToChat() })
  expect(loadURL).toHaveBeenLastCalledWith(chatSessionUrl)
  expect(session.getSnapshot()).toMatchObject({ phase: 'ready', navigating: true })
  expect((view.container.querySelector('[data-deepseek-chat-guest]') as HTMLElement).style.visibility).toBe('visible')
  Object.assign(guest, { getURL: () => chatSessionUrl })
  guest.dispatchEvent(new Event('did-stop-loading'))
  await waitFor(() => { expect(session.getSnapshot().phase).toBe('ready') })
  expect(session.getSnapshot().navigating).toBe(false)
  expect(session.getSnapshot().outsideChat).toBe(false)
  act(() => { session.reload() })
  expect(reload).toHaveBeenCalledOnce()
  expect(session.getSnapshot()).toMatchObject({ phase: 'ready', navigating: true })
  guest.dispatchEvent(new Event('did-stop-loading'))
  await waitFor(() => { expect(session.getSnapshot().phase).toBe('ready') })
  expect(session.getSnapshot().navigating).toBe(false)
  view.rerender(<div><div /><BrowserChatOverlay {...props} /></div>)
  await waitFor(() => { expect(view.container.querySelector('webview')).toBe(guest) })
  expect(release).not.toHaveBeenCalled()
  view.unmount()
  await waitFor(() => { expect(release).toHaveBeenCalledExactlyOnceWith('lease-1') })
})

it('keeps the guest hidden until a language change reload finishes', async () => {
  vi.stubGlobal('ResizeObserver', class { observe(): void {} unobserve(): void {} disconnect(): void {} })
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => { callback(0) }, 0))
  vi.stubGlobal('cancelAnimationFrame', (id: number) => { clearTimeout(id) })
  const bridge = {
    acquire: vi.fn(async () => ({ lease: 'lease-2', partition: 'dsh-sidebar-browser-test' })),
    release: vi.fn(async () => {}),
    onOpenRequested: vi.fn(() => () => {}),
  }
  const session = new BrowserChatSession()
  const props = { bridge, session, getPreferredLanguage: () => 'zh_CN',
    t: (key: keyof typeof zh) => zh[key] } as BrowserChatOverlayProps
  const view = render(<div><div><div data-deepseek-chat-seat /></div><BrowserChatOverlay {...props} /></div>)
  await waitFor(() => { expect(view.container.querySelector('webview')).not.toBeNull() })
  const guest = view.container.querySelector('webview')!
  const reload = vi.fn()
  const executeJavaScript = vi.fn(async () => true)
  Object.assign(guest, { getURL: () => 'https://chat.deepseek.com/sign_in', reload, executeJavaScript })
  guest.dispatchEvent(new Event('did-stop-loading'))
  await waitFor(() => { expect(reload).toHaveBeenCalledOnce() })
  expect(session.getSnapshot().phase).toBe('loading')
  guest.dispatchEvent(new Event('did-stop-loading'))
  expect(session.getSnapshot().phase).toBe('ready')
  expect(executeJavaScript).toHaveBeenCalledOnce()
  view.unmount()
})

it('ignores a superseded external load failure while returning to the previous Chat session', async () => {
  vi.stubGlobal('ResizeObserver', class { observe(): void {} unobserve(): void {} disconnect(): void {} })
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => { callback(0) }, 0))
  vi.stubGlobal('cancelAnimationFrame', (id: number) => { clearTimeout(id) })
  let openRequested: ((url: string) => void) | undefined
  let rejectExternal: ((reason: Error) => void) | undefined
  const bridge = {
    acquire: vi.fn(async () => ({ lease: 'lease-return', partition: 'dsh-sidebar-browser-test' })),
    release: vi.fn(async () => {}),
    onOpenRequested: vi.fn((_lease: string, listener: (url: string) => void) => {
      openRequested = listener
      return () => {}
    }),
  }
  const session = new BrowserChatSession()
  const props = { bridge, session, getPreferredLanguage: () => 'zh_CN',
    t: (key: keyof typeof zh) => zh[key] } as BrowserChatOverlayProps
  const view = render(<div><div><div data-deepseek-chat-seat /></div><BrowserChatOverlay {...props} /></div>)
  await waitFor(() => { expect(openRequested).toBeDefined() })
  const guest = view.container.querySelector('webview')!
  const chatSessionUrl = 'https://chat.deepseek.com/a/chat/s/example-session'
  const externalUrl = 'https://example.org/help'
  const loadURL = vi.fn((url: string) => url === externalUrl
    ? new Promise<void>((_resolve, reject) => { rejectExternal = reject }) : Promise.resolve())
  Object.assign(guest, { getURL: () => chatSessionUrl, loadURL, executeJavaScript: async () => false })
  guest.dispatchEvent(new Event('did-stop-loading'))
  await waitFor(() => { expect(session.getSnapshot().phase).toBe('ready') })

  act(() => { openRequested!(externalUrl) })
  Object.assign(guest, { getURL: () => externalUrl })
  guest.dispatchEvent(new Event('did-stop-loading'))
  expect(session.getSnapshot().outsideChat).toBe(true)
  act(() => { session.returnToChat() })
  expect(loadURL).toHaveBeenLastCalledWith(chatSessionUrl)
  await act(async () => {
    rejectExternal!(new Error('superseded navigation'))
    await Promise.resolve()
  })
  guest.dispatchEvent(Object.assign(new Event('did-fail-load'), {
    isMainFrame: true, errorCode: -105, validatedURL: externalUrl,
  }))
  guest.dispatchEvent(new Event('did-stop-loading'))
  expect(session.getSnapshot()).toMatchObject({ phase: 'ready', navigating: true })
  Object.assign(guest, { getURL: () => chatSessionUrl })
  guest.dispatchEvent(new Event('did-stop-loading'))
  await waitFor(() => { expect(session.getSnapshot().phase).toBe('ready') })
  expect(session.getSnapshot().navigating).toBe(false)
  expect(session.getSnapshot().outsideChat).toBe(false)
  view.unmount()
})

it('reports an acquire that never settles and allows another attempt', async () => {
  vi.stubGlobal('ResizeObserver', class { observe(): void {} unobserve(): void {} disconnect(): void {} })
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => { callback(0) }, 0))
  vi.stubGlobal('cancelAnimationFrame', (id: number) => { clearTimeout(id) })
  const originalSetTimeout = globalThis.setTimeout
  const loadTimeouts: Array<() => void> = []
  vi.spyOn(globalThis, 'setTimeout').mockImplementation(((handler: TimerHandler, delay?: number, ...args: unknown[]) => {
    if (delay === 30_000) {
      loadTimeouts.push(handler as () => void)
      return 1 as ReturnType<typeof setTimeout>
    }
    return originalSetTimeout(handler, delay, ...args)
  }) as typeof setTimeout)
  const bridge = {
    acquire: vi.fn(() => new Promise<{ lease: string; partition: string }>(() => {})),
    release: vi.fn(async () => {}),
    onOpenRequested: vi.fn(() => () => {}),
  }
  const session = new BrowserChatSession()
  const props = { bridge, session, getPreferredLanguage: () => 'zh_CN',
    t: (key: keyof typeof zh) => zh[key] } as BrowserChatOverlayProps
  const view = render(<div><div><div data-deepseek-chat-seat /></div><BrowserChatOverlay {...props} /></div>)
  await waitFor(() => { expect(bridge.acquire).toHaveBeenCalledOnce() })
  expect(loadTimeouts).toHaveLength(1)
  act(() => { loadTimeouts[0]!() })
  expect(session.getSnapshot().phase).toBe('error')
  expect(session.getSnapshot().errorReason).toBe('timeout')
  act(() => { session.retry() })
  await waitFor(() => { expect(bridge.acquire).toHaveBeenCalledTimes(2) })
  expect(session.getSnapshot().phase).toBe('loading')
  view.unmount()
})

it('ignores a popup navigation failure from a disposed guest after retry', async () => {
  vi.stubGlobal('ResizeObserver', class { observe(): void {} unobserve(): void {} disconnect(): void {} })
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => { callback(0) }, 0))
  vi.stubGlobal('cancelAnimationFrame', (id: number) => { clearTimeout(id) })
  let openRequested: ((url: string) => void) | undefined
  let rejectOld: ((reason: Error) => void) | undefined
  const bridge = {
    acquire: vi.fn(async () => ({ lease: 'lease-old', partition: 'dsh-sidebar-browser-test' })),
    release: vi.fn(async () => {}),
    onOpenRequested: vi.fn((_lease: string, listener: (url: string) => void) => {
      openRequested = listener
      return () => {}
    }),
  }
  const session = new BrowserChatSession()
  const props = { bridge, session, getPreferredLanguage: () => 'zh_CN',
    t: (key: keyof typeof zh) => zh[key] } as BrowserChatOverlayProps
  const view = render(<div><div><div data-deepseek-chat-seat /></div><BrowserChatOverlay {...props} /></div>)
  await waitFor(() => { expect(openRequested).toBeDefined() })
  const guest = view.container.querySelector('webview')!
  Object.assign(guest, { loadURL: (url: string) => url === 'https://example.org/help'
    ? new Promise<void>((_resolve, reject) => { rejectOld = reject }) : Promise.resolve() })
  act(() => { openRequested!('https://example.org/help'); session.retry() })
  await waitFor(() => { expect(bridge.acquire).toHaveBeenCalledTimes(2) })
  await act(async () => { rejectOld!(new Error('old guest removed')); await Promise.resolve() })
  expect(session.getSnapshot().phase).toBe('loading')
  view.unmount()
})
