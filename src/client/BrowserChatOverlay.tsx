/** Retained guest: the shell overlay stays mounted while main panels switch. */
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { BrowserChatSession, DesktopBrowserBridge } from './BrowserChatSession.ts'
import { initialLanguageScript, type ChatLanguage } from './chatLanguage.ts'
import css from './BrowserChatOverlay.module.css'
import panelCss from './ChatPanel.module.css'

const CHAT_URL = 'https://chat.deepseek.com/'
const CHAT_ORIGIN = new URL(CHAT_URL).origin
const STORAGE_ACCOUNT = 'deepseek-chat'
const LOAD_TIMEOUT_MS = 30_000

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
  const { retry, phase } = useSyncExternalStore(session.subscribe, session.getSnapshot)

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
      const modalOpen = document.querySelector('[role="dialog"][aria-modal="true"]') !== null
      const otherMenuOpen = Array.from(document.querySelectorAll('[role="menu"]'))
        .some(menu => !menu.classList.contains(panelCss.moreMenu))
      const blocked = document.hidden || modalOpen || otherMenuOpen
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
    // Preload while the Agent panel is active so the first Chat open can reuse a ready guest.
    if (host.current === null) return
    let disposed = false
    let failed = false
    let lease: string | undefined
    let unsubscribe = () => {}
    let detachNavigation = () => {}
    let webview: ChatWebview | undefined
    let languageStage: 'pending' | 'checking' | 'reloading' | 'ready' = 'pending'
    let languageCheck = 0
    let navigationRevision = 0
    let lastChatUrl = CHAT_URL
    let returningToChat = false
    let loadTimeout: ReturnType<typeof setTimeout> | undefined
    const isCurrent = (): boolean => !disposed && session.getSnapshot().retry === retry
    const clearLoadTimeout = (): void => {
      if (loadTimeout !== undefined) clearTimeout(loadTimeout)
      loadTimeout = undefined
    }
    const fail = (reason: 'timeout' | 'load' = 'load'): void => {
      if (!isCurrent() || failed) return
      failed = true
      clearLoadTimeout()
      session.setError(reason)
    }
    const ready = (): void => {
      if (!isCurrent() || failed) return
      clearLoadTimeout()
      session.setPhase('ready')
    }
    const armLoadTimeout = (): void => {
      clearLoadTimeout()
      loadTimeout = setTimeout(() => { fail('timeout') }, LOAD_TIMEOUT_MS)
    }
    const isChatDocument = (guest: ChatWebview): boolean => {
      try { return new URL(guest.getURL()).origin === CHAT_ORIGIN } catch { return false }
    }
    const rememberChatUrl = (url: string): void => {
      try {
        const parsed = new URL(url)
        if (parsed.origin === CHAT_ORIGIN) lastChatUrl = parsed.href
      } catch { /* The guest may still be on its bootstrap document. */ }
    }
    const rememberCurrentChatUrl = (guest: ChatWebview): void => {
      try { rememberChatUrl(guest.getURL()) } catch { /* The guest may be navigating. */ }
    }
    const load = (guest: ChatWebview, url: string): void => {
      const revision = ++navigationRevision
      void guest.loadURL(url).catch((error: unknown) => {
        if (revision !== navigationRevision || (typeof error === 'object' && error !== null
          && 'code' in error && error.code === 'ERR_ABORTED')) return
        fail()
      })
    }
    session.setPhase('loading')
    armLoadTimeout()
    void bridge.acquire(STORAGE_ACCOUNT).then(reservation => {
      if (!isCurrent() || failed) return bridge.release(reservation.lease)
      lease = reservation.lease
      const guest = document.createElement('webview') as ChatWebview
      webview = guest
      guest.className = css.webview as string
      guest.setAttribute('name', reservation.lease)
      guest.setAttribute('partition', reservation.partition)
      guest.setAttribute('allowpopups', '')
      guest.setAttribute('src', `about:blank#${reservation.lease}`)
      guest.setAttribute('aria-label', titleRef.current)
      guest.addEventListener('dom-ready', () => {
        if (!isCurrent() || failed) return
        let url: string
        try { url = guest.getURL() } catch { fail(); return }
        if (url.startsWith('about:blank#')) load(guest, CHAT_URL)
      })
      guest.addEventListener('did-start-navigation', event => {
        const navigation = event as Event & { url?: string; isMainFrame?: boolean }
        if (!isCurrent() || failed || !navigation.isMainFrame || typeof navigation.url !== 'string') return
        rememberCurrentChatUrl(guest)
        try {
          const url = new URL(navigation.url)
          if (url.protocol === 'http:' || url.protocol === 'https:') session.setOutsideChat(url.origin !== CHAT_ORIGIN)
        } catch { /* Navigation will be rejected by the Desktop bridge. */ }
      })
      for (const name of ['did-navigate', 'did-navigate-in-page']) {
        guest.addEventListener(name, event => {
          if (!isCurrent() || failed || (name === 'did-navigate-in-page'
            && !(event as Event & { isMainFrame?: boolean }).isMainFrame)) return
          rememberCurrentChatUrl(guest)
        })
      }
      guest.addEventListener('did-stop-loading', () => {
        if (!isCurrent() || failed || session.getSnapshot().phase === 'error') return
        let url: URL
        try { url = new URL(guest.getURL()) } catch { return }
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return
        if (returningToChat && url.origin !== CHAT_ORIGIN) return
        session.setOutsideChat(url.origin !== CHAT_ORIGIN)
        if (url.origin !== CHAT_ORIGIN) {
          languageCheck += 1
          languageStage = 'pending'
          ready()
          return
        }
        returningToChat = false
        rememberChatUrl(url.href)
        if (languageStage === 'ready') { ready(); return }
        if (languageStage === 'reloading') {
          languageStage = 'ready'
          ready()
          return
        }
        if (languageStage !== 'pending') return
        languageStage = 'checking'
        const check = ++languageCheck
        void guest.executeJavaScript(initialLanguageScript(getPreferredLanguageRef.current())).then(reload => {
          if (!isCurrent() || check !== languageCheck || !isChatDocument(guest)) return
          if (reload === true) {
            languageStage = 'reloading'
            try { guest.reload() } catch { fail() }
          } else {
            languageStage = 'ready'
            ready()
          }
        }).catch(() => {
          if (isCurrent() && check === languageCheck && isChatDocument(guest)) { languageStage = 'ready'; ready() }
        })
      })
      guest.addEventListener('did-fail-load', event => {
        const failure = event as Event & { isMainFrame?: boolean; errorCode?: number; validatedURL?: string }
        if (!failure.isMainFrame || failure.errorCode === -3) return
        if (returningToChat && typeof failure.validatedURL === 'string') {
          try { if (new URL(failure.validatedURL).origin !== CHAT_ORIGIN) return } catch { /* Treat an unknown URL as failure. */ }
        }
        fail()
      })
      guest.addEventListener('render-process-gone', () => { fail() })
      unsubscribe = bridge.onOpenRequested(reservation.lease, url => {
        if (!isCurrent() || failed) return
        rememberCurrentChatUrl(guest)
        load(guest, url)
      })
      host.current?.append(guest)
      detachNavigation = session.attachNavigation({
        reload: () => {
          if (!isCurrent()) return
          navigationRevision += 1
          languageCheck += 1
          languageStage = 'pending'
          session.setNavigating(true)
          armLoadTimeout()
          try { guest.reload() } catch { fail() }
        },
        returnToChat: () => {
          if (!isCurrent()) return
          returningToChat = true
          languageCheck += 1
          languageStage = 'pending'
          session.setNavigating(true)
          armLoadTimeout()
          load(guest, lastChatUrl)
        },
      })
    }).catch(() => { fail() })
    return () => {
      disposed = true
      clearLoadTimeout()
      unsubscribe()
      detachNavigation()
      webview?.remove()
      if (lease !== undefined) void bridge.release(lease).catch(() => {})
    }
  }, [bridge, retry, session])

  useEffect(() => { host.current?.querySelector('webview')?.setAttribute('aria-label', title) }, [title])

  const style: CSSProperties = seat === undefined ? { visibility: 'hidden', pointerEvents: 'none' }
    : { left: seat.left, top: seat.top, width: seat.width, height: seat.height,
      visibility: phase === 'ready' ? 'visible' : 'hidden', pointerEvents: phase === 'ready' ? 'auto' : 'none' }
  return <div ref={host} className={css.host} style={style} data-deepseek-chat-guest />
}
