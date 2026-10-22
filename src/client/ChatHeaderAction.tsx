/** DeepSeek Chat launcher in the Agent Session header's right-side utilities. */
import type { ReactNode } from 'react'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { ChatGlyph } from './ChatPanelIcon.tsx'
import css from './ChatHeaderAction.module.css'

type ChatHeaderActionProps = PropsRuntime<'conversation.session.header.utilities'>
  & PropsLocale<'deepseekChat'>
  & InjectFace<{ readonly open: () => void }>

/** @param props - localized label and main-panel navigation. @returns an accessible header button. */
export function ChatHeaderAction({ open, t }: ChatHeaderActionProps): ReactNode {
  const label = t('panel')
  return (
    <Tooltip label={label} delayMs={500}>
      <button type="button" className={css.button} data-deepseek-chat-header-entry=""
        aria-label={label} onClick={open}>
        <ChatGlyph size={16} />
      </button>
    </Tooltip>
  )
}
