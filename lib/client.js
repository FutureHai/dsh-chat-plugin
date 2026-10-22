window.__ModuleLoader__.load({
  id: "dsh-chat-plugin",
  factory: (require) => {
    "use strict";
    var module = { exports: {} };
    var exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/BrowserChatPanel.tsx
var import_react = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/ChatPanel.module.css
var css = "._8kbuAW_page{width:100%;min-width:0;height:100%;min-height:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);flex-direction:column;flex:auto;display:flex}._8kbuAW_header{box-sizing:border-box;border-bottom:.5px solid var(--dsw-alias-border-l3);-webkit-app-region:drag;flex:none;align-items:center;gap:16px;min-height:64px;padding:16px 24px;display:flex}._8kbuAW_header button{-webkit-app-region:no-drag}[data-platform=darwin] ._8kbuAW_header{padding-top:calc(16px + var(--dsh-frame-top-clearance,0px))}._8kbuAW_title{flex:1;min-width:0;margin:0;font-size:17px;font-weight:600}._8kbuAW_seat{flex:1;min-height:0;position:relative;overflow:hidden}._8kbuAW_message,._8kbuAW_failure{text-align:center;width:min(480px,100% - 48px);color:var(--dsw-alias-label-secondary);margin:0;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}._8kbuAW_actions{flex-wrap:wrap;justify-content:center;gap:12px;margin-top:20px;display:flex}";
var tagId = "dsh-chat-plugin/ChatPanel.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-chat-plugin";
  tag.dataset.pluginCss = tagId;
  tag.textContent = css;
  document.head.appendChild(tag);
}
var ChatPanel_default = { "actions": "_8kbuAW_actions", "failure": "_8kbuAW_failure", "header": "_8kbuAW_header", "message": "_8kbuAW_message", "page": "_8kbuAW_page", "seat": "_8kbuAW_seat", "title": "_8kbuAW_title" };

// src/client/BrowserChatPanel.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function BrowserChatPanel({ session, back, t }) {
  const state = (0, import_react.useSyncExternalStore)(session.subscribe, session.getSnapshot);
  const [showClear, setShowClear] = (0, import_react.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ChatPanel_default.page, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: ChatPanel_default.header, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "outline", size: "sm", onClick: back, children: t("back") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: ChatPanel_default.title, children: t("title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "outline", size: "sm", onClick: () => {
        setShowClear(true);
      }, children: t("clear") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ChatPanel_default.seat, "data-deepseek-chat-seat": true, children: [
      state.phase === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: ChatPanel_default.message, children: t("loading") }),
      state.phase === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ChatPanel_default.failure, role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("failed") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: ChatPanel_default.actions, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "primary", size: "sm", onClick: () => {
          session.retry();
        }, children: t("retry") }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_dsh_client_ui_primitives.Modal,
      {
        open: showClear,
        onClose: () => {
          setShowClear(false);
        },
        title: t("restartClearTitle"),
        closeLabel: t("close"),
        description: t("restartClearDescription"),
        footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "primary", onClick: () => {
          setShowClear(false);
        }, children: t("close") })
      }
    )
  ] });
}

// src/client/BrowserChatOverlay.tsx
var import_react2 = require("react");

// src/client/chatLanguage.ts
function chatLanguageForHarness(active) {
  return /^zh(?:[-_]|$)/i.test(active) ? "zh_CN" : "en_US";
}
function initialLanguageScript(language) {
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
  })()`;
}

// src/client/BrowserChatOverlay.module.css
var css2 = ".tq3TJq_host{background:var(--dsw-alias-bg-base);flex-direction:column;width:0;height:0;display:flex;position:absolute;overflow:hidden}.tq3TJq_webview{-webkit-app-region:no-drag;border:0;flex:auto;width:100%;min-width:0;height:100%;min-height:0;display:flex}";
var tagId2 = "dsh-chat-plugin/BrowserChatOverlay.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId2) + "]") === null) {
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-chat-plugin";
  tag.dataset.pluginCss = tagId2;
  tag.textContent = css2;
  document.head.appendChild(tag);
}
var BrowserChatOverlay_default = { "host": "tq3TJq_host", "webview": "tq3TJq_webview" };

// src/client/BrowserChatOverlay.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var CHAT_URL = "https://chat.deepseek.com/";
var CHAT_ORIGIN = new URL(CHAT_URL).origin;
var STORAGE_ACCOUNT = "deepseek-chat";
function BrowserChatOverlay({ bridge, session, getPreferredLanguage, t }) {
  const host = (0, import_react2.useRef)(null);
  const title = t("title");
  const titleRef = (0, import_react2.useRef)(title);
  titleRef.current = title;
  const getPreferredLanguageRef = (0, import_react2.useRef)(getPreferredLanguage);
  getPreferredLanguageRef.current = getPreferredLanguage;
  const [seat, setSeat] = (0, import_react2.useState)();
  const [opened, setOpened] = (0, import_react2.useState)(false);
  const { retry, phase } = (0, import_react2.useSyncExternalStore)(session.subscribe, session.getSnapshot);
  (0, import_react2.useEffect)(() => {
    if (seat !== void 0) setOpened(true);
  }, [seat]);
  (0, import_react2.useEffect)(() => {
    let frame = 0;
    let observed;
    const resize = new ResizeObserver(schedule);
    const overlay = host.current?.parentElement;
    const layout = overlay?.parentElement;
    if (overlay !== null && overlay !== void 0) resize.observe(overlay);
    function update() {
      frame = 0;
      const element = document.querySelector("[data-deepseek-chat-seat]");
      if (observed !== element) {
        if (observed !== void 0) resize.unobserve(observed);
        observed = element ?? void 0;
        if (element !== null) resize.observe(element);
      }
      const parent = host.current?.parentElement;
      const blocked = document.hidden || document.querySelector('[role="dialog"][aria-modal="true"], [role="menu"]') !== null;
      if (element === null || parent === null || parent === void 0 || blocked) {
        setSeat(void 0);
        return;
      }
      const bounds = element.getBoundingClientRect();
      const origin = parent.getBoundingClientRect();
      const next = {
        left: bounds.left - origin.left,
        top: bounds.top - origin.top,
        width: bounds.width,
        height: bounds.height
      };
      setSeat((previous) => previous?.left === next.left && previous.top === next.top && previous.width === next.width && previous.height === next.height ? previous : next);
    }
    function schedule() {
      if (frame === 0) frame = requestAnimationFrame(update);
    }
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["role", "aria-modal"] });
    const layoutChanges = new MutationObserver(schedule);
    if (layout !== null && layout !== void 0) {
      layoutChanges.observe(layout, { attributes: true, attributeFilter: [
        "style",
        "class",
        "data-animating",
        "data-sidebar-collapsed",
        "data-rightbar-collapsed",
        "data-rightbar-fullscreen"
      ] });
      layout.addEventListener("transitionend", schedule);
    }
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      layoutChanges.disconnect();
      layout?.removeEventListener("transitionend", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, []);
  (0, import_react2.useEffect)(() => {
    if (!opened || host.current === null) return;
    let disposed = false;
    let lease;
    let unsubscribe = () => {
    };
    let webview;
    let languageStage = "pending";
    session.setPhase("loading");
    void bridge.acquire(STORAGE_ACCOUNT).then((reservation) => {
      lease = reservation.lease;
      if (disposed) return bridge.release(reservation.lease);
      const guest = document.createElement("webview");
      webview = guest;
      guest.className = BrowserChatOverlay_default.webview;
      guest.setAttribute("name", reservation.lease);
      guest.setAttribute("partition", reservation.partition);
      guest.setAttribute("allowpopups", "");
      guest.setAttribute("src", `about:blank#${reservation.lease}`);
      guest.setAttribute("aria-label", titleRef.current);
      guest.addEventListener("dom-ready", () => {
        if (guest.getURL().startsWith("about:blank#")) {
          void guest.loadURL(CHAT_URL).catch(() => {
            if (!disposed) session.setPhase("error");
          });
        }
      });
      guest.addEventListener("did-stop-loading", () => {
        if (disposed || session.getSnapshot().phase === "error") return;
        let url;
        try {
          url = new URL(guest.getURL());
        } catch {
          return;
        }
        if (url.origin !== CHAT_ORIGIN) return;
        if (languageStage === "ready") {
          session.setPhase("ready");
          return;
        }
        if (languageStage === "reloading") {
          languageStage = "ready";
          session.setPhase("ready");
          return;
        }
        if (languageStage !== "pending") return;
        languageStage = "checking";
        void guest.executeJavaScript(initialLanguageScript(getPreferredLanguageRef.current())).then((reload) => {
          if (disposed) return;
          if (reload === true) {
            languageStage = "reloading";
            guest.reload();
          } else {
            languageStage = "ready";
            session.setPhase("ready");
          }
        }).catch(() => {
          if (!disposed) {
            languageStage = "ready";
            session.setPhase("ready");
          }
        });
      });
      guest.addEventListener("did-fail-load", (event) => {
        const failure = event;
        if (!disposed && failure.isMainFrame && failure.errorCode !== -3) session.setPhase("error");
      });
      guest.addEventListener("render-process-gone", () => {
        if (!disposed) session.setPhase("error");
      });
      unsubscribe = bridge.onOpenRequested(reservation.lease, (url) => {
        if (!disposed) void guest.loadURL(url).catch(() => {
          session.setPhase("error");
        });
      });
      host.current?.append(guest);
    }).catch(() => {
      if (!disposed) session.setPhase("error");
    });
    return () => {
      disposed = true;
      unsubscribe();
      webview?.remove();
      if (lease !== void 0) void bridge.release(lease).catch(() => {
      });
    };
  }, [bridge, retry, opened, session]);
  (0, import_react2.useEffect)(() => {
    host.current?.querySelector("webview")?.setAttribute("aria-label", title);
  }, [title]);
  const style = seat === void 0 ? { visibility: "hidden", pointerEvents: "none" } : {
    left: seat.left,
    top: seat.top,
    width: seat.width,
    height: seat.height,
    visibility: phase === "ready" ? "visible" : "hidden",
    pointerEvents: phase === "ready" ? "auto" : "none"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { ref: host, className: BrowserChatOverlay_default.host, style, "data-deepseek-chat-guest": true });
}

// src/client/BrowserChatSession.ts
var BrowserChatSession = class {
  snapshot = { phase: "loading", retry: 0 };
  listeners = /* @__PURE__ */ new Set();
  getSnapshot = () => this.snapshot;
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  setPhase(phase) {
    if (this.snapshot.phase === phase) return;
    this.publish({ ...this.snapshot, phase });
  }
  retry() {
    this.publish({ phase: "loading", retry: this.snapshot.retry + 1 });
  }
  publish(next) {
    this.snapshot = next;
    for (const listener of this.listeners) listener();
  }
};

// src/client/ChatPanelIcon.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function ChatGlyph({ size }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "path",
      {
        d: "M2.4 10.7a6.5 6.5 0 1 1 3.2 2.7c-.8-.52-1.6-.56-2.3-.1l-1.2.82",
        stroke: "currentColor",
        strokeWidth: "1.25",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M4.6 6.4h6.8M4.6 9h3.6", stroke: "currentColor", strokeWidth: "1.25", strokeLinecap: "round" })
  ] });
}
function ChatPanelIcon({ size }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ChatGlyph, { size });
}

// src/client/ChatHeaderAction.tsx
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/ChatHeaderAction.module.css
var css3 = ".dkf_YG_button{border-radius:var(--dsw-radius-sm);width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;-webkit-app-region:no-drag;background:0 0;border:0;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.dkf_YG_button:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dkf_YG_button:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:2px}";
var tagId3 = "dsh-chat-plugin/ChatHeaderAction.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId3) + "]") === null) {
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-chat-plugin";
  tag.dataset.pluginCss = tagId3;
  tag.textContent = css3;
  document.head.appendChild(tag);
}
var ChatHeaderAction_default = { "button": "dkf_YG_button" };

// src/client/ChatHeaderAction.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function ChatHeaderAction({ open, t }) {
  const label = t("panel");
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_dsh_client_ui_primitives2.Tooltip, { label, delayMs: 500, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "button",
    {
      type: "button",
      className: ChatHeaderAction_default.button,
      "data-deepseek-chat-header-entry": "",
      "aria-label": label,
      onClick: open,
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ChatGlyph, { size: 16 })
    }
  ) });
}

// src/client/locales.ts
var zh = {
  panel: "DeepSeek Chat",
  title: "DeepSeek Chat",
  back: "\u8FD4\u56DE Agent",
  loading: "\u6B63\u5728\u6253\u5F00 DeepSeek Chat\u2026",
  failed: "\u65E0\u6CD5\u6253\u5F00 DeepSeek Chat\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  retry: "\u91CD\u8BD5",
  clear: "\u6E05\u9664\u672C\u5730\u767B\u5F55\u6570\u636E",
  close: "\u5173\u95ED",
  restartClearTitle: "\u6E05\u9664\u5F53\u524D Chat \u7684\u672C\u5730\u767B\u5F55\u6570\u636E",
  restartClearDescription: "\u8BF7\u9000\u51FA\u6240\u6709 Harness Desktop \u7A97\u53E3\u548C\u540E\u53F0\u8FDB\u7A0B\uFF0C\u7136\u540E\u91CD\u65B0\u6253\u5F00\u3002\u6B64\u63D2\u4EF6\u4F7F\u7528\u5185\u5B58\u5206\u533A\uFF1B\u5B8C\u6574\u9000\u51FA\u540E\uFF0C\u8BE5\u5206\u533A\u4E2D\u7684\u767B\u5F55\u72B6\u6001\u548C\u7AD9\u70B9\u5B58\u50A8\u4F1A\u6E05\u9664\u3002"
};
var en = {
  panel: "DeepSeek Chat",
  title: "DeepSeek Chat",
  back: "Back to Agent",
  loading: "Opening DeepSeek Chat\u2026",
  failed: "DeepSeek Chat could not open. Please try again.",
  retry: "Retry",
  clear: "Clear local login data",
  close: "Close",
  restartClearTitle: "Clear local Chat login data",
  restartClearDescription: "Quit all Harness Desktop windows and background processes, then reopen it. This plugin uses an in-memory partition; a complete exit clears its login state and site storage."
};

// src/client/index.ts
var PANEL_ID = "deepseek-chat";
var inject = ["slots", "locale", "layout"];
function apply(ctx) {
  const carrier = globalThis.dshDesktop;
  if (carrier?.protocolVersion !== 1 || carrier.browser === void 0) return;
  ctx.effect(() => ctx.locale.register("deepseekChat", { zh, en }), "dsh-chat-plugin: copy");
  const t = ctx.locale.bind("deepseekChat");
  const bridge = carrier.browser;
  const session = new BrowserChatSession();
  ctx.slots.inject("shell.overlay", () => ctx.slots.register({
    name: "shell.overlay",
    id: "deepseek-chat-guest",
    locale: "deepseekChat",
    inject: () => ({
      bridge,
      session,
      getPreferredLanguage: () => chatLanguageForHarness(ctx.locale.getSnapshot().active)
    })
  }, BrowserChatOverlay));
  ctx.slots.inject("main", () => ctx.slots.register({
    name: "main",
    key: PANEL_ID,
    locale: "deepseekChat",
    inject: () => ({ session, back: () => {
      ctx.layout.selectPanel(null);
    } })
  }, BrowserChatPanel));
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
    name: "sidebar.panellist",
    id: PANEL_ID,
    label: () => t("panel"),
    locale: "deepseekChat"
  }, ChatPanelIcon));
  ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
    name: "conversation.session.header.utilities",
    id: "deepseek-chat",
    order: 5,
    locale: "deepseekChat",
    inject: () => ({ open: () => {
      ctx.layout.selectPanel(PANEL_ID);
    } })
  }, ChatHeaderAction));
}

    return module.exports;
  }
});
