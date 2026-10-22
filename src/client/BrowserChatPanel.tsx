/** Controls for the installable plugin's retained Electron Browser guest. */
import { useState, useSyncExternalStore, type ReactNode } from 'react'
import { Button, Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { BrowserChatSession } from './BrowserChatSession.ts'
import css from './ChatPanel.module.css'

export interface BrowserChatPanelFace {
  readonly session: BrowserChatSession
  back(): void
}

export type BrowserChatPanelProps = PropsRuntime<'main'> & PropsLocale<'deepseekChat'> & InjectFace<BrowserChatPanelFace>

/** @returns the Chat controls and a measurable seat beneath the header. */
export function BrowserChatPanel({ session, back, t }: BrowserChatPanelProps): ReactNode {
  const state = useSyncExternalStore(session.subscribe, session.getSnapshot)
  const [showClear, setShowClear] = useState(false)
  return (
    <div className={css.page}>
      <header className={css.header}>
        <Button variant="outline" size="sm" onClick={back}>{t('back')}</Button>
        <h1 className={css.title}>{t('title')}</h1>
        <Button variant="outline" size="sm" onClick={() => { setShowClear(true) }}>{t('clear')}</Button>
      </header>
      <div className={css.seat} data-deepseek-chat-seat>
        {state.phase === 'loading' && <p className={css.message}>{t('loading')}</p>}
        {state.phase === 'error' && (
          <div className={css.failure} role="alert">
            <p>{t('failed')}</p>
            <div className={css.actions}>
              <Button variant="primary" size="sm" onClick={() => { session.retry() }}>{t('retry')}</Button>
            </div>
          </div>
        )}
      </div>
      <Modal open={showClear} onClose={() => { setShowClear(false) }} title={t('restartClearTitle')}
        closeLabel={t('close')} description={t('restartClearDescription')}
        footer={<Button variant="primary" onClick={() => { setShowClear(false) }}>{t('close')}</Button>} />
    </div>
  )
}
