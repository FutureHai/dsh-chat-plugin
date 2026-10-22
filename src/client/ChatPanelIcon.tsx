/** Round conversation glyph inspired by the official Chat entry. */
import type { ReactNode } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'

/** @param props - sidebar icon size. @returns a glyph distinct from New Session. */
export function ChatPanelIcon({ size }: PropsRuntime<'sidebar.panellist'>): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.4 10.7a6.5 6.5 0 1 1 3.2 2.7c-.8-.52-1.6-.56-2.3-.1l-1.2.82"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M4.6 6.4h6.8M4.6 9h3.6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}
