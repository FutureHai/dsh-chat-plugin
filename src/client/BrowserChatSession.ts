/** Process-local presentation state for the installable Desktop Browser variant. */
export type BrowserChatPhase = 'loading' | 'ready' | 'error'

export interface BrowserChatSnapshot {
  readonly phase: BrowserChatPhase
  readonly retry: number
  readonly outsideChat: boolean
  readonly navigating: boolean
  readonly errorReason?: 'timeout' | 'load'
}

interface BrowserChatNavigation {
  reload(): void
  returnToChat(): void
}

/** The official Desktop bridge issues a guest in a process-lifetime partition. */
export interface DesktopBrowserBridge {
  acquire(workspace: string): Promise<{ readonly lease: string; readonly partition: string }>
  release(lease: string): Promise<void>
  onOpenRequested(lease: string, listener: (url: string) => void): () => void
}

/** Shared by the main-panel controls and retained overlay of one Client plugin. */
export class BrowserChatSession {
  private snapshot: BrowserChatSnapshot = { phase: 'loading', retry: 0, outsideChat: false, navigating: false }
  private readonly listeners = new Set<() => void>()
  private navigation: BrowserChatNavigation | undefined

  getSnapshot = (): BrowserChatSnapshot => this.snapshot
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  setPhase(phase: BrowserChatPhase): void {
    if (this.snapshot.phase === phase && !this.snapshot.navigating && this.snapshot.errorReason === undefined) return
    this.publish({ ...this.snapshot, phase, navigating: false, errorReason: undefined })
  }

  setError(errorReason: 'timeout' | 'load'): void {
    if (this.snapshot.phase === 'error' && this.snapshot.errorReason === errorReason) return
    this.publish({ ...this.snapshot, phase: 'error', navigating: false, errorReason })
  }

  setNavigating(navigating: boolean): void {
    if (this.snapshot.phase !== 'ready' || this.snapshot.navigating === navigating) return
    this.publish({ ...this.snapshot, navigating })
  }

  setOutsideChat(outsideChat: boolean): void {
    if (this.snapshot.outsideChat === outsideChat) return
    this.publish({ ...this.snapshot, outsideChat })
  }

  attachNavigation(navigation: BrowserChatNavigation): () => void {
    this.navigation = navigation
    return () => { if (this.navigation === navigation) this.navigation = undefined }
  }

  reload(): void {
    if (this.navigation === undefined) this.retry()
    else this.navigation.reload()
  }

  returnToChat(): void {
    if (this.navigation === undefined) this.retry()
    else this.navigation.returnToChat()
  }

  retry(): void {
    this.publish({ phase: 'loading', retry: this.snapshot.retry + 1, outsideChat: false, navigating: false })
  }

  private publish(next: BrowserChatSnapshot): void {
    this.snapshot = next
    for (const listener of this.listeners) listener()
  }
}
