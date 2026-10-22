/** Reuse the existing chat glyph for the sidebar entry. */
import type { ReactNode } from 'react'
import { IconNewChatOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'

/** @param props - sidebar icon size. @returns the existing chat icon. */
export function ChatPanelIcon({ size }: PropsRuntime<'sidebar.panellist'>): ReactNode {
  return <IconNewChatOutlineRegular size={size} />
}
