// @vitest-environment jsdom
/** A retained overlay keeps its guest while the main panel unmounts. */
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, waitFor } from '@testing-library/react'
import { BrowserChatOverlay, type BrowserChatOverlayProps } from '../src/client/BrowserChatOverlay.tsx'
import { BrowserChatSession } from '../src/client/BrowserChatSession.ts'
import { zh } from '../src/client/locales.ts'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

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
  Object.assign(guest, { getURL: () => 'about:blank#lease-1', loadURL, executeJavaScript })
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
