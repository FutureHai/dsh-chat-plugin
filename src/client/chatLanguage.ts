/** DeepSeek Chat currently stores its website language separately from Harness. */
export type ChatLanguage = 'zh_CN' | 'en_US'

/** Harness resolves its explicit preference against the OS language before this is read. */
export function chatLanguageForHarness(active: string): ChatLanguage {
  return /^zh(?:[-_]|$)/i.test(active) ? 'zh_CN' : 'en_US'
}

/** Set only the website's default language; keep a language chosen inside Chat. */
export function initialLanguageScript(language: ChatLanguage): string {
  return `(() => {
    try {
      const key = '__appKit_@deepseek/chat_localePreference';
      const raw = localStorage.getItem(key);
      let stored;
      if (raw !== null) {
        stored = JSON.parse(raw);
        const current = stored && typeof stored === 'object' ? stored.value : stored;
        if (current !== 'system') return false;
      }
      const next = stored && typeof stored === 'object' && !Array.isArray(stored)
        ? { ...stored, value: ${JSON.stringify(language)} }
        : { value: ${JSON.stringify(language)}, __version: '0' };
      localStorage.setItem(key, JSON.stringify(next));
      const pageLanguage = document.documentElement.lang.toLowerCase();
      return ${JSON.stringify(language)} === 'zh_CN'
        ? pageLanguage !== 'zh-cn'
        : !pageLanguage.startsWith('en');
    } catch {
      return false;
    }
  })()`
}
