/** Locale-owned copy for the Desktop DeepSeek Chat panel. */
export const zh = {
  panel: 'DeepSeek Chat',
  title: 'DeepSeek Chat',
  back: '返回 Agent',
  loading: '正在打开 DeepSeek Chat…',
  navigating: '网页加载中…',
  failed: '无法打开 DeepSeek Chat，请重试。',
  timedOut: '打开 DeepSeek Chat 超时，请检查网络后重试。',
  retry: '重试',
  reload: '重新加载网页',
  more: '更多操作',
  returnToChat: '回到 Chat',
  clear: '本地登录数据说明…',
  clearHint: '完整退出桌面端后清除',
  close: '关闭',
  restartClearTitle: '本地登录数据说明',
  restartClearDescription: '请退出所有 Harness Desktop 窗口和后台进程，然后重新打开。此插件使用内存分区；完整退出后，该分区中的登录状态和站点存储会清除。',
} satisfies Record<string, string>

/** Keys accepted by the DeepSeek Chat translator. */
export type DeepSeekChatKey = keyof typeof zh

/** English dictionary with matching keys. */
export const en = {
  panel: 'DeepSeek Chat',
  title: 'DeepSeek Chat',
  back: 'Back to Agent',
  loading: 'Opening DeepSeek Chat…',
  navigating: 'Loading page…',
  failed: 'DeepSeek Chat could not open. Please try again.',
  timedOut: 'Opening DeepSeek Chat timed out. Check your connection and retry.',
  retry: 'Retry',
  reload: 'Reload page',
  more: 'More actions',
  returnToChat: 'Return to Chat',
  clear: 'Local login data…',
  clearHint: 'Cleared after fully quitting Desktop',
  close: 'Close',
  restartClearTitle: 'Local login data',
  restartClearDescription: 'Quit all Harness Desktop windows and background processes, then reopen it. This plugin uses an in-memory partition; a complete exit clears its login state and site storage.',
} satisfies Record<DeepSeekChatKey, string>

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Main-panel DeepSeek Chat controls and states. */
    deepseekChat: DeepSeekChatKey
  }
}
