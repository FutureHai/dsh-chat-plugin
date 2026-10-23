/** Controls for the installable plugin's retained Electron Browser guest. */
import { useState, useSyncExternalStore, type ReactNode } from 'react'
import {
  Button, IconChevronLeftOutlineRegular, IconEllipsisOutlineRegular, IconInfoOutlineRegular,
  IconRefreshOutlineRegular, Menu, MenuItemButton, Modal, Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
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
  const [showMore, setShowMore] = useState(false)
  return (
    <div className={css.page}>
      <header className={css.header}>
        <Button variant="ghost" size="sm" className={css.backButton}
          icon={<IconChevronLeftOutlineRegular size={16} />} onClick={back}>{t('back')}</Button>
        <h1 className={css.title}>{t('title')}</h1>
        <div className={css.headerActions}>
          {state.navigating && <span className={css.status} role="status">{t('navigating')}</span>}
          {state.outsideChat && state.phase === 'ready' && (
            <Button variant="outline" size="sm" disabled={state.navigating}
              onClick={() => { session.returnToChat() }}>{t('returnToChat')}</Button>
          )}
          <Tooltip label={t('reload')} side="bottom" portal delayMs={500}
            disabled={state.phase !== 'ready' || state.navigating}>
            <button type="button" className={css.iconButton} aria-label={t('reload')}
              disabled={state.phase !== 'ready' || state.navigating}
              onClick={() => { session.reload() }}>
              <IconRefreshOutlineRegular size={16} />
            </button>
          </Tooltip>
          <Menu open={showMore} onClose={() => { setShowMore(false) }} align="end" portal autoFocus
            listClassName={css.moreMenu}
            anchor={(
              <Tooltip label={t('more')} side="bottom" portal delayMs={500} disabled={showMore}>
                <button type="button" className={css.iconButton} aria-label={t('more')}
                  aria-haspopup="menu" aria-expanded={showMore}
                  onClick={() => { setShowMore(value => !value) }}
                  onKeyDown={(event) => {
                    if (!showMore && event.key === 'ArrowDown') { event.preventDefault(); setShowMore(true) }
                  }}>
                  <IconEllipsisOutlineRegular size={16} />
                </button>
              </Tooltip>
            )}>
            <MenuItemButton icon={<IconInfoOutlineRegular size={14} />}
              onSelect={() => { setShowMore(false); setShowClear(true) }}>
              <span className={css.moreMenuItem}>
                <span>{t('clear')}</span>
                <span className={css.moreMenuHint}>{t('clearHint')}</span>
              </span>
            </MenuItemButton>
          </Menu>
        </div>
      </header>
      <div className={css.seat} data-deepseek-chat-seat>
        {state.phase === 'loading' && (
          <div className={css.message}>
            <p>{t('loading')}</p>
            <div className={css.actions}>
              <Button variant="outline" size="sm" onClick={() => { session.retry() }}>{t('retry')}</Button>
            </div>
          </div>
        )}
        {state.phase === 'error' && (
          <div className={css.failure} role="alert">
            <p>{t(state.errorReason === 'timeout' ? 'timedOut' : 'failed')}</p>
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
