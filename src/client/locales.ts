/** Locale-owned copy for the Desktop DeepSeek Chat panel. */
export const zh = {
  panel: 'DeepSeek Chat',
  title: 'DeepSeek Chat',
  back: '返回 Agent',
  loading: '正在打开 DeepSeek Chat…',
  failed: '无法打开 DeepSeek Chat，请重试。',
  retry: '重试',
  clear: '清除本地登录数据',
  close: '关闭',
  restartClearTitle: '清除当前 Chat 的本地登录数据',
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
  failed: 'DeepSeek Chat could not open. Please try again.',
  retry: 'Retry',
  clear: 'Clear local login data',
  close: 'Close',
  restartClearTitle: 'Clear local Chat login data',
  restartClearDescription: 'Quit all Harness Desktop windows and background processes, then reopen it. This plugin uses an in-memory partition; a complete exit clears its login state and site storage.',
} satisfies Record<DeepSeekChatKey, string>

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Main-panel DeepSeek Chat controls and states. */
    deepseekChat: DeepSeekChatKey
  }
}
