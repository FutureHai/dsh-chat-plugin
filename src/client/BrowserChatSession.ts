/** Process-local presentation state for the installable Desktop Browser variant. */
export type BrowserChatPhase = 'loading' | 'ready' | 'error'

export interface BrowserChatSnapshot {
  readonly phase: BrowserChatPhase
  readonly retry: number
}

/** The official Desktop bridge issues a guest in a process-lifetime partition. */
export interface DesktopBrowserBridge {
  acquire(workspace: string): Promise<{ readonly lease: string; readonly partition: string }>
  release(lease: string): Promise<void>
  onOpenRequested(lease: string, listener: (url: string) => void): () => void
}

/** Shared by the main-panel controls and retained overlay of one Client plugin. */
export class BrowserChatSession {
  private snapshot: BrowserChatSnapshot = { phase: 'loading', retry: 0 }
  private readonly listeners = new Set<() => void>()

  getSnapshot = (): BrowserChatSnapshot => this.snapshot
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  setPhase(phase: BrowserChatPhase): void {
    if (this.snapshot.phase === phase) return
    this.publish({ ...this.snapshot, phase })
  }

  retry(): void {
    this.publish({ phase: 'loading', retry: this.snapshot.retry + 1 })
  }

  private publish(next: BrowserChatSnapshot): void {
    this.snapshot = next
    for (const listener of this.listeners) listener()
  }
}
