/** Retained guest: the shell overlay stays mounted while main panels switch. */
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { BrowserChatSession, DesktopBrowserBridge } from './BrowserChatSession.ts'
import { initialLanguageScript, type ChatLanguage } from './chatLanguage.ts'
import css from './BrowserChatOverlay.module.css'

const CHAT_URL = 'https://chat.deepseek.com/'
const CHAT_ORIGIN = new URL(CHAT_URL).origin
const STORAGE_ACCOUNT = 'deepseek-chat'

interface ChatWebview extends HTMLElement {
  loadURL(url: string): Promise<void>
  getURL(): string
  executeJavaScript(code: string): Promise<unknown>
  reload(): void
}

export interface BrowserChatOverlayFace {
  readonly bridge: DesktopBrowserBridge
  readonly session: BrowserChatSession
  getPreferredLanguage(): ChatLanguage
}

export type BrowserChatOverlayProps = PropsRuntime<'shell.overlay'> & PropsLocale<'deepseekChat'> & InjectFace<BrowserChatOverlayFace>

interface SeatBounds { readonly left: number; readonly top: number; readonly width: number; readonly height: number }

/** @returns one guest anchored to the active Chat panel without unmounting on Agent navigation. */
export function BrowserChatOverlay({ bridge, session, getPreferredLanguage, t }: BrowserChatOverlayProps): ReactNode {
  const host = useRef<HTMLDivElement>(null)
  const title = t('title')
  const titleRef = useRef(title)
  titleRef.current = title
  const getPreferredLanguageRef = useRef(getPreferredLanguage)
  getPreferredLanguageRef.current = getPreferredLanguage
  const [seat, setSeat] = useState<SeatBounds | undefined>()
  const [opened, setOpened] = useState(false)
  const { retry, phase } = useSyncExternalStore(session.subscribe, session.getSnapshot)

  useEffect(() => { if (seat !== undefined) setOpened(true) }, [seat])

  useEffect(() => {
    let frame = 0
    let observed: Element | undefined
    const resize = new ResizeObserver(schedule)
    const overlay = host.current?.parentElement
    const layout = overlay?.parentElement
    if (overlay !== null && overlay !== undefined) resize.observe(overlay)
    function update(): void {
      frame = 0
      const element = document.querySelector('[data-deepseek-chat-seat]')
      if (observed !== element) {
        if (observed !== undefined) resize.unobserve(observed)
        observed = element ?? undefined
        if (element !== null) resize.observe(element)
      }
      const parent = host.current?.parentElement
      const blocked = document.hidden || document.querySelector('[role="dialog"][aria-modal="true"], [role="menu"]') !== null
      if (element === null || parent === null || parent === undefined || blocked) { setSeat(undefined); return }
      const bounds = element.getBoundingClientRect()
      const origin = parent.getBoundingClientRect()
      const next = { left: bounds.left - origin.left, top: bounds.top - origin.top,
        width: bounds.width, height: bounds.height }
      setSeat(previous => previous?.left === next.left && previous.top === next.top
        && previous.width === next.width && previous.height === next.height ? previous : next)
    }
    function schedule(): void {
      if (frame === 0) frame = requestAnimationFrame(update)
    }
    const mutations = new MutationObserver(schedule)
    mutations.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['role', 'aria-modal'] })
    const layoutChanges = new MutationObserver(schedule)
    if (layout !== null && layout !== undefined) {
      layoutChanges.observe(layout, { attributes: true, attributeFilter: [
        'style', 'class', 'data-animating', 'data-sidebar-collapsed', 'data-rightbar-collapsed',
        'data-rightbar-fullscreen',
      ] })
      layout.addEventListener('transitionend', schedule)
    }
    window.addEventListener('resize', schedule)
    document.addEventListener('visibilitychange', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      mutations.disconnect()
      layoutChanges.disconnect()
      layout?.removeEventListener('transitionend', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [])

  useEffect(() => {
    if (!opened || host.current === null) return
    let disposed = false
    let lease: string | undefined
    let unsubscribe = () => {}
    let webview: ChatWebview | undefined
    let languageStage: 'pending' | 'checking' | 'reloading' | 'ready' = 'pending'
    session.setPhase('loading')
    void bridge.acquire(STORAGE_ACCOUNT).then(reservation => {
      lease = reservation.lease
      if (disposed) return bridge.release(reservation.lease)
      const guest = document.createElement('webview') as ChatWebview
      webview = guest
      guest.className = css.webview as string
      guest.setAttribute('name', reservation.lease)
      guest.setAttribute('partition', reservation.partition)
      guest.setAttribute('allowpopups', '')
      guest.setAttribute('src', `about:blank#${reservation.lease}`)
      guest.setAttribute('aria-label', titleRef.current)
      guest.addEventListener('dom-ready', () => {
        if (guest.getURL().startsWith('about:blank#')) {
          void guest.loadURL(CHAT_URL).catch(() => { if (!disposed) session.setPhase('error') })
        }
      })
      guest.addEventListener('did-stop-loading', () => {
        if (disposed || session.getSnapshot().phase === 'error') return
        let url: URL
        try { url = new URL(guest.getURL()) } catch { return }
        if (url.origin !== CHAT_ORIGIN) return
        if (languageStage === 'ready') { session.setPhase('ready'); return }
        if (languageStage === 'reloading') {
          languageStage = 'ready'
          session.setPhase('ready')
          return
        }
        if (languageStage !== 'pending') return
        languageStage = 'checking'
        void guest.executeJavaScript(initialLanguageScript(getPreferredLanguageRef.current())).then(reload => {
          if (disposed) return
          if (reload === true) {
            languageStage = 'reloading'
            guest.reload()
          } else {
            languageStage = 'ready'
            session.setPhase('ready')
          }
        }).catch(() => {
          if (!disposed) { languageStage = 'ready'; session.setPhase('ready') }
        })
      })
      guest.addEventListener('did-fail-load', event => {
        const failure = event as Event & { isMainFrame?: boolean; errorCode?: number }
        if (!disposed && failure.isMainFrame && failure.errorCode !== -3) session.setPhase('error')
      })
      guest.addEventListener('render-process-gone', () => { if (!disposed) session.setPhase('error') })
      unsubscribe = bridge.onOpenRequested(reservation.lease, url => {
        if (!disposed) void guest.loadURL(url).catch(() => { session.setPhase('error') })
      })
      host.current?.append(guest)
    }).catch(() => { if (!disposed) session.setPhase('error') })
    return () => {
      disposed = true
      unsubscribe()
      webview?.remove()
      if (lease !== undefined) void bridge.release(lease).catch(() => {})
    }
  }, [bridge, retry, opened, session])

  useEffect(() => { host.current?.querySelector('webview')?.setAttribute('aria-label', title) }, [title])

  const style: CSSProperties = seat === undefined ? { visibility: 'hidden', pointerEvents: 'none' }
    : { left: seat.left, top: seat.top, width: seat.width, height: seat.height,
      visibility: phase === 'ready' ? 'visible' : 'hidden', pointerEvents: phase === 'ready' ? 'auto' : 'none' }
  return <div ref={host} className={css.host} style={style} data-deepseek-chat-guest />
}
