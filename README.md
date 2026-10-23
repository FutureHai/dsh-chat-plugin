# dsh-chat-plugin

[简体中文](README.zh-CN.md) | English

An independent plugin that opens the official [DeepSeek Chat](https://chat.deepseek.com/) website in the main panel of DeepSeek Harness Desktop. Open Chat from the left sidebar or the icon in the Agent Session header's right-side utilities. Switching between Chat and Agent does not reload the Chat page. The header icon appears when a nonblank Agent Session is open, including while the left sidebar is collapsed.

This project is community maintained and is not an official DeepSeek release.

## Requirements

- DeepSeek Harness Desktop `0.2.1-rc.2` or later in the `0.2.x` series, with the `dshDesktop.browser` bridge.
- Node.js 22.19 or later to build from source. The committed `lib/` files let a local directory or Git install load without a build step.

## Install

Fully quit DeepSeek Harness Desktop, then install the plugin from GitHub:

```sh
dsh plugin --profile desktop add github:FutureHai/dsh-chat-plugin
```

Reopen Desktop and select **DeepSeek Chat** in the sidebar. For a local checkout, select the repository root (containing `package.json` and `cordis.patch.yml`) in Desktop's plugin manager, or run `dsh plugin --profile desktop add /absolute/path/to/dsh-chat-plugin`. If an earlier local build of this plugin is installed, remove it before installing from GitHub.

The committed `lib/index.js` and `lib/client.js` make installation possible without an install-time build. Pin a Git commit when you need a reproducible installation.

## Behavior and limits

- The embedded page is the official Chat website. SMS login happens on that page; the plugin does not handle passwords, codes, cookies, or chat text.
- The same operating-system user's Harness workspaces share the Chat browser partition while the Desktop process is running. The retained view preserves login and unsent drafts when switching Chat ↔ Agent.
- If loading stalls, the panel offers Retry and reports a timeout after 30 seconds. Reload refreshes the current page; Return to Chat restores the previous Chat address after navigation to another website. The page stays visible with a small loading status during either action.
- The official Desktop Browser bridge uses an in-memory partition. After **all** Desktop processes exit, website storage is cleared and Chat requires a new login. **More actions → Local login data…** explains that exit procedure; it does not revoke server-side sessions.
- When a new Chat browser partition first opens, the plugin initializes the website language from the active Harness language (which follows the OS when no preference was selected). A specific language selected inside Chat lasts until Desktop fully exits. Selecting **System** is remapped to the Harness language when a new Chat guest opens. Changing the Harness language while Chat is open does not reload Chat or discard a draft.
- You can still change the website language under **Settings → General → Language**. The plugin reads and writes only the website's language preference; if DeepSeek changes that internal storage format, this initialization may need an update.
- Other website login methods and update transitions have not been verified.

## Develop

```sh
npm ci --legacy-peer-deps
npm run check
```

`npm run check` type-checks the plugin, runs focused behavior tests, builds `lib/`, and checks the installable bundle. Rebuild and commit the two `lib/` files after changing `src/`. Use `npm pack --dry-run` to inspect the npm release contents. The build is self-contained and does not need a Harness source checkout.

## License

MIT, copyright 2026 haihui. DeepSeek Harness and DeepSeek Chat are separate projects with their own licenses and trademarks.
