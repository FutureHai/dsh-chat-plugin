/** Desktop-only main panel for the official DeepSeek Chat page. */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { BrowserChatPanel } from './BrowserChatPanel.tsx'
import { BrowserChatOverlay } from './BrowserChatOverlay.tsx'
import { BrowserChatSession, type DesktopBrowserBridge } from './BrowserChatSession.ts'
import { ChatPanelIcon } from './ChatPanelIcon.tsx'
import { ChatHeaderAction } from './ChatHeaderAction.tsx'
import { chatLanguageForHarness } from './chatLanguage.ts'
import { en, zh } from './locales.ts'

const PANEL_ID = 'deepseek-chat' as MainPanelId

/** Services used by the Chat panel, retained guest, and navigation entries. */
export const inject = ['slots', 'locale', 'layout']

/** Register the installable Desktop Browser guest. */
export function apply(ctx: ClientContext): void {
  const carrier = (globalThis as typeof globalThis & {
    dshDesktop?: { readonly protocolVersion: number; readonly browser?: DesktopBrowserBridge }
  }).dshDesktop
  if (carrier?.protocolVersion !== 1 || carrier.browser === undefined) return
  ctx.effect(() => ctx.locale.register('deepseekChat', { zh, en }), 'dsh-chat-plugin: copy')
  const t = ctx.locale.bind('deepseekChat')
  const bridge = carrier.browser
  const session = new BrowserChatSession()
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'deepseek-chat-guest', locale: 'deepseekChat',
    inject: () => ({ bridge, session,
      getPreferredLanguage: () => chatLanguageForHarness(ctx.locale.getSnapshot().active) }),
  }, BrowserChatOverlay))
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main', key: PANEL_ID, locale: 'deepseekChat',
    inject: () => ({ session, back: () => { ctx.layout.selectPanel(null) } }),
  }, BrowserChatPanel))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist', id: PANEL_ID, label: () => t('panel'), locale: 'deepseekChat',
  }, ChatPanelIcon))
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities', id: 'deepseek-chat', order: 5,
    locale: 'deepseekChat', inject: () => ({ open: () => { ctx.layout.selectPanel(PANEL_ID) } }),
  }, ChatHeaderAction))
}
