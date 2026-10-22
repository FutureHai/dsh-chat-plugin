# dsh-chat-plugin

简体中文 | [English](README.md)

这是一个独立插件，在 DeepSeek Harness Desktop 的主面板打开[官方 DeepSeek Chat 网站](https://chat.deepseek.com/)。可以从左侧菜单或 Agent 会话标题栏右侧的图标进入 Chat；在 Chat 与 Agent 间切换不会重载 Chat 网页。左侧菜单折叠后，该顶部图标仍可使用；空白会话页不显示此图标。

本项目由社区维护，不是 DeepSeek 官方发布的插件。

## 环境要求

- DeepSeek Harness Desktop `0.2.1-rc.2` 或同系列更新版本，并提供 `dshDesktop.browser` 桥接。
- 从源码构建需要 Node.js 22.19 或更新版本。仓库提交了 `lib/` 产物，本地目录或 Git 安装无需在安装时构建。

## 安装

完全退出 DeepSeek Harness Desktop，然后从 GitHub 安装插件：

```sh
dsh plugin --profile desktop add github:FutureHai/dsh-chat-plugin
```

重新打开 Desktop，在左侧选择 **DeepSeek Chat**。如需安装本地源码目录，可在 Desktop 插件管理器中选择包含 `package.json` 和 `cordis.patch.yml` 的仓库根目录，或运行 `dsh plugin --profile desktop add /absolute/path/to/dsh-chat-plugin`。如果已安装该插件的早期本地构建版本，请先卸载，再从 GitHub 安装。

仓库已提交 `lib/index.js` 和 `lib/client.js`，安装时无需构建。需要可复现安装时，建议固定 Git 提交版本。

## 行为与限制

- 内嵌页面是官方 Chat 网站。短信登录在该网页完成；插件不处理密码、验证码、Cookie 或聊天正文。
- 同一系统用户的 Harness 工作区在 Desktop 进程运行期间共享 Chat 浏览器分区。切换 Chat ↔ Agent 时，保留登录状态和未发送草稿。
- 官方 Desktop Browser 桥接使用内存分区。**所有** Desktop 进程退出后，站点存储会清空，下次需重新登录。**清除本地登录数据** 会说明此退出流程；它不会撤销服务端会话。
- 新建 Chat 浏览器分区首次打开时，插件按 Harness 当前语言（未手动设置时按系统语言）初始化 Chat 网页语言。网页内已明确选择的语言会保留到本次 Desktop 完整退出；运行中切换 Harness 语言不会重载 Chat 或覆盖草稿。
- 仍可在 DeepSeek Chat 的 **Settings → General → Language** 中单独改语言。插件只读写该站点的语言偏好项；若官网以后修改其内部存储格式，此自动设置可能需要更新。
- 其他网页登录方式与版本更新过程尚未验证。

## 开发

```sh
npm ci --legacy-peer-deps
npm run check
```

`npm run check` 执行类型检查、针对性行为测试、`lib/` 构建和安装包检查。修改 `src/` 后重新构建并提交两个 `lib/` 文件。可用 `npm pack --dry-run` 检查 npm 发布文件。构建无需 Harness 源码仓库。

## 许可证

MIT，版权 2026 haihui。DeepSeek Harness 与 DeepSeek Chat 是独立项目，各自有其许可证和商标。
