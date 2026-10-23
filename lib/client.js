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
var css = "._8kbuAW_page{width:100%;min-width:0;height:100%;min-height:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);flex-direction:column;flex:auto;display:flex}._8kbuAW_header{box-sizing:border-box;border-bottom:.5px solid var(--dsw-alias-border-l3);-webkit-app-region:drag;flex-wrap:wrap;flex:none;align-items:center;gap:8px 16px;min-height:80px;padding:28px 36px 16px;display:flex}._8kbuAW_header button{-webkit-app-region:no-drag}[data-platform=darwin] ._8kbuAW_header{padding-top:calc(28px + var(--dsh-frame-top-clearance,0px))}._8kbuAW_backButton{color:var(--dsw-alias-label-secondary);white-space:nowrap;flex:none;padding-inline:4px}._8kbuAW_title{text-overflow:ellipsis;white-space:nowrap;flex:160px;min-width:110px;margin:0;font-size:20px;font-weight:500;line-height:28px;overflow:hidden}._8kbuAW_headerActions{flex:none;justify-content:flex-end;align-items:center;gap:12px;max-width:100%;margin-left:auto;display:flex}._8kbuAW_iconButton{border-radius:var(--dsw-radius-sm);width:28px;height:28px;color:var(--dsw-alias-label-caption);cursor:pointer;-webkit-app-region:no-drag;background:0 0;border:0;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}._8kbuAW_iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}._8kbuAW_iconButton:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:1px}._8kbuAW_iconButton:disabled{opacity:.5;cursor:default}._8kbuAW_moreMenu{-webkit-app-region:no-drag;width:260px;max-width:calc(100vw - 24px)}._8kbuAW_moreMenu [role=menuitem]{box-sizing:border-box;gap:8px;min-height:60px;padding:8px 12px}._8kbuAW_moreMenuItem{white-space:normal;flex-direction:column;gap:2px;min-width:0;display:flex}._8kbuAW_moreMenuHint{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}._8kbuAW_status{color:var(--dsw-alias-label-secondary);white-space:nowrap;font-size:12px}._8kbuAW_seat{flex:1;min-height:0;position:relative;overflow:hidden}._8kbuAW_message,._8kbuAW_failure{text-align:center;width:min(480px,100% - 48px);color:var(--dsw-alias-label-secondary);margin:0;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}._8kbuAW_actions{flex-wrap:wrap;justify-content:center;gap:12px;margin-top:20px;display:flex}";
var tagId = "dsh-chat-plugin/ChatPanel.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-chat-plugin";
  tag.dataset.pluginCss = tagId;
  tag.textContent = css;
  document.head.appendChild(tag);
}
var ChatPanel_default = { "actions": "_8kbuAW_actions", "backButton": "_8kbuAW_backButton", "failure": "_8kbuAW_failure", "header": "_8kbuAW_header", "headerActions": "_8kbuAW_headerActions", "iconButton": "_8kbuAW_iconButton", "message": "_8kbuAW_message", "moreMenu": "_8kbuAW_moreMenu", "moreMenuHint": "_8kbuAW_moreMenuHint", "moreMenuItem": "_8kbuAW_moreMenuItem", "page": "_8kbuAW_page", "seat": "_8kbuAW_seat", "status": "_8kbuAW_status", "title": "_8kbuAW_title" };

// src/client/BrowserChatPanel.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function BrowserChatPanel({ session, back, t }) {
  const state = (0, import_react.useSyncExternalStore)(session.subscribe, session.getSnapshot);
  const [showClear, setShowClear] = (0, import_react.useState)(false);
  const [showMore, setShowMore] = (0, import_react.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ChatPanel_default.page, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: ChatPanel_default.header, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_dsh_client_ui_primitives.Button,
        {
          variant: "ghost",
          size: "sm",
          className: ChatPanel_default.backButton,
          icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconChevronLeftOutlineRegular, { size: 16 }),
          onClick: back,
          children: t("back")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: ChatPanel_default.title, children: t("title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ChatPanel_default.headerActions, children: [
        state.navigating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: ChatPanel_default.status, role: "status", children: t("navigating") }),
        state.outsideChat && state.phase === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_dsh_client_ui_primitives.Button,
          {
            variant: "outline",
            size: "sm",
            disabled: state.navigating,
            onClick: () => {
              session.returnToChat();
            },
            children: t("returnToChat")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_dsh_client_ui_primitives.Tooltip,
          {
            label: t("reload"),
            side: "bottom",
            portal: true,
            delayMs: 500,
            disabled: state.phase !== "ready" || state.navigating,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: ChatPanel_default.iconButton,
                "aria-label": t("reload"),
                disabled: state.phase !== "ready" || state.navigating,
                onClick: () => {
                  session.reload();
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconRefreshOutlineRegular, { size: 16 })
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_dsh_client_ui_primitives.Menu,
          {
            open: showMore,
            onClose: () => {
              setShowMore(false);
            },
            align: "end",
            portal: true,
            autoFocus: true,
            listClassName: ChatPanel_default.moreMenu,
            anchor: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Tooltip, { label: t("more"), side: "bottom", portal: true, delayMs: 500, disabled: showMore, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: ChatPanel_default.iconButton,
                "aria-label": t("more"),
                "aria-haspopup": "menu",
                "aria-expanded": showMore,
                onClick: () => {
                  setShowMore((value) => !value);
                },
                onKeyDown: (event) => {
                  if (!showMore && event.key === "ArrowDown") {
                    event.preventDefault();
                    setShowMore(true);
                  }
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconEllipsisOutlineRegular, { size: 16 })
              }
            ) }),
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_dsh_client_ui_primitives.MenuItemButton,
              {
                icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconInfoOutlineRegular, { size: 14 }),
                onSelect: () => {
                  setShowMore(false);
                  setShowClear(true);
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: ChatPanel_default.moreMenuItem, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("clear") }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: ChatPanel_default.moreMenuHint, children: t("clearHint") })
                ] })
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ChatPanel_default.seat, "data-deepseek-chat-seat": true, children: [
      state.phase === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ChatPanel_default.message, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loading") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: ChatPanel_default.actions, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "outline", size: "sm", onClick: () => {
          session.retry();
        }, children: t("retry") }) })
      ] }),
      state.phase === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: ChatPanel_default.failure, role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t(state.errorReason === "timeout" ? "timedOut" : "failed") }),
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
        try { stored = JSON.parse(raw); } catch { stored = undefined; }
      }
      const object = stored !== null && typeof stored === 'object' && !Array.isArray(stored);
      const current = object ? stored.value : stored;
      if (typeof current === 'string' && current.trim() !== '' && current !== 'system') return false;
      const next = object
        ? { ...stored, __version: typeof stored.__version === 'string' ? stored.__version : '0', value: ${JSON.stringify(language)} }
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
var LOAD_TIMEOUT_MS = 3e4;
function BrowserChatOverlay({ bridge, session, getPreferredLanguage, t }) {
  const host = (0, import_react2.useRef)(null);
  const title = t("title");
  const titleRef = (0, import_react2.useRef)(title);
  titleRef.current = title;
  const getPreferredLanguageRef = (0, import_react2.useRef)(getPreferredLanguage);
  getPreferredLanguageRef.current = getPreferredLanguage;
  const [seat, setSeat] = (0, import_react2.useState)();
  const { retry, phase } = (0, import_react2.useSyncExternalStore)(session.subscribe, session.getSnapshot);
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
      const modalOpen = document.querySelector('[role="dialog"][aria-modal="true"]') !== null;
      const otherMenuOpen = Array.from(document.querySelectorAll('[role="menu"]')).some((menu) => !menu.classList.contains(ChatPanel_default.moreMenu));
      const blocked = document.hidden || modalOpen || otherMenuOpen;
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
    if (host.current === null) return;
    let disposed = false;
    let failed = false;
    let lease;
    let unsubscribe = () => {
    };
    let detachNavigation = () => {
    };
    let webview;
    let languageStage = "pending";
    let languageCheck = 0;
    let navigationRevision = 0;
    let lastChatUrl = CHAT_URL;
    let returningToChat = false;
    let loadTimeout;
    const isCurrent = () => !disposed && session.getSnapshot().retry === retry;
    const clearLoadTimeout = () => {
      if (loadTimeout !== void 0) clearTimeout(loadTimeout);
      loadTimeout = void 0;
    };
    const fail = (reason = "load") => {
      if (!isCurrent() || failed) return;
      failed = true;
      clearLoadTimeout();
      session.setError(reason);
    };
    const ready = () => {
      if (!isCurrent() || failed) return;
      clearLoadTimeout();
      session.setPhase("ready");
    };
    const armLoadTimeout = () => {
      clearLoadTimeout();
      loadTimeout = setTimeout(() => {
        fail("timeout");
      }, LOAD_TIMEOUT_MS);
    };
    const isChatDocument = (guest) => {
      try {
        return new URL(guest.getURL()).origin === CHAT_ORIGIN;
      } catch {
        return false;
      }
    };
    const rememberChatUrl = (url) => {
      try {
        const parsed = new URL(url);
        if (parsed.origin === CHAT_ORIGIN) lastChatUrl = parsed.href;
      } catch {
      }
    };
    const rememberCurrentChatUrl = (guest) => {
      try {
        rememberChatUrl(guest.getURL());
      } catch {
      }
    };
    const load = (guest, url) => {
      const revision = ++navigationRevision;
      void guest.loadURL(url).catch((error) => {
        if (revision !== navigationRevision || typeof error === "object" && error !== null && "code" in error && error.code === "ERR_ABORTED") return;
        fail();
      });
    };
    session.setPhase("loading");
    armLoadTimeout();
    void bridge.acquire(STORAGE_ACCOUNT).then((reservation) => {
      if (!isCurrent() || failed) return bridge.release(reservation.lease);
      lease = reservation.lease;
      const guest = document.createElement("webview");
      webview = guest;
      guest.className = BrowserChatOverlay_default.webview;
      guest.setAttribute("name", reservation.lease);
      guest.setAttribute("partition", reservation.partition);
      guest.setAttribute("allowpopups", "");
      guest.setAttribute("src", `about:blank#${reservation.lease}`);
      guest.setAttribute("aria-label", titleRef.current);
      guest.addEventListener("dom-ready", () => {
        if (!isCurrent() || failed) return;
        let url;
        try {
          url = guest.getURL();
        } catch {
          fail();
          return;
        }
        if (url.startsWith("about:blank#")) load(guest, CHAT_URL);
      });
      guest.addEventListener("did-start-navigation", (event) => {
        const navigation = event;
        if (!isCurrent() || failed || !navigation.isMainFrame || typeof navigation.url !== "string") return;
        rememberCurrentChatUrl(guest);
        try {
          const url = new URL(navigation.url);
          if (url.protocol === "http:" || url.protocol === "https:") session.setOutsideChat(url.origin !== CHAT_ORIGIN);
        } catch {
        }
      });
      for (const name of ["did-navigate", "did-navigate-in-page"]) {
        guest.addEventListener(name, (event) => {
          if (!isCurrent() || failed || name === "did-navigate-in-page" && !event.isMainFrame) return;
          rememberCurrentChatUrl(guest);
        });
      }
      guest.addEventListener("did-stop-loading", () => {
        if (!isCurrent() || failed || session.getSnapshot().phase === "error") return;
        let url;
        try {
          url = new URL(guest.getURL());
        } catch {
          return;
        }
        if (url.protocol !== "http:" && url.protocol !== "https:") return;
        if (returningToChat && url.origin !== CHAT_ORIGIN) return;
        session.setOutsideChat(url.origin !== CHAT_ORIGIN);
        if (url.origin !== CHAT_ORIGIN) {
          languageCheck += 1;
          languageStage = "pending";
          ready();
          return;
        }
        returningToChat = false;
        rememberChatUrl(url.href);
        if (languageStage === "ready") {
          ready();
          return;
        }
        if (languageStage === "reloading") {
          languageStage = "ready";
          ready();
          return;
        }
        if (languageStage !== "pending") return;
        languageStage = "checking";
        const check = ++languageCheck;
        void guest.executeJavaScript(initialLanguageScript(getPreferredLanguageRef.current())).then((reload) => {
          if (!isCurrent() || check !== languageCheck || !isChatDocument(guest)) return;
          if (reload === true) {
            languageStage = "reloading";
            try {
              guest.reload();
            } catch {
              fail();
            }
          } else {
            languageStage = "ready";
            ready();
          }
        }).catch(() => {
          if (isCurrent() && check === languageCheck && isChatDocument(guest)) {
            languageStage = "ready";
            ready();
          }
        });
      });
      guest.addEventListener("did-fail-load", (event) => {
        const failure = event;
        if (!failure.isMainFrame || failure.errorCode === -3) return;
        if (returningToChat && typeof failure.validatedURL === "string") {
          try {
            if (new URL(failure.validatedURL).origin !== CHAT_ORIGIN) return;
          } catch {
          }
        }
        fail();
      });
      guest.addEventListener("render-process-gone", () => {
        fail();
      });
      unsubscribe = bridge.onOpenRequested(reservation.lease, (url) => {
        if (!isCurrent() || failed) return;
        rememberCurrentChatUrl(guest);
        load(guest, url);
      });
      host.current?.append(guest);
      detachNavigation = session.attachNavigation({
        reload: () => {
          if (!isCurrent()) return;
          navigationRevision += 1;
          languageCheck += 1;
          languageStage = "pending";
          session.setNavigating(true);
          armLoadTimeout();
          try {
            guest.reload();
          } catch {
            fail();
          }
        },
        returnToChat: () => {
          if (!isCurrent()) return;
          returningToChat = true;
          languageCheck += 1;
          languageStage = "pending";
          session.setNavigating(true);
          armLoadTimeout();
          load(guest, lastChatUrl);
        }
      });
    }).catch(() => {
      fail();
    });
    return () => {
      disposed = true;
      clearLoadTimeout();
      unsubscribe();
      detachNavigation();
      webview?.remove();
      if (lease !== void 0) void bridge.release(lease).catch(() => {
      });
    };
  }, [bridge, retry, session]);
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
  snapshot = { phase: "loading", retry: 0, outsideChat: false, navigating: false };
  listeners = /* @__PURE__ */ new Set();
  navigation;
  getSnapshot = () => this.snapshot;
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  setPhase(phase) {
    if (this.snapshot.phase === phase && !this.snapshot.navigating && this.snapshot.errorReason === void 0) return;
    this.publish({ ...this.snapshot, phase, navigating: false, errorReason: void 0 });
  }
  setError(errorReason) {
    if (this.snapshot.phase === "error" && this.snapshot.errorReason === errorReason) return;
    this.publish({ ...this.snapshot, phase: "error", navigating: false, errorReason });
  }
  setNavigating(navigating) {
    if (this.snapshot.phase !== "ready" || this.snapshot.navigating === navigating) return;
    this.publish({ ...this.snapshot, navigating });
  }
  setOutsideChat(outsideChat) {
    if (this.snapshot.outsideChat === outsideChat) return;
    this.publish({ ...this.snapshot, outsideChat });
  }
  attachNavigation(navigation) {
    this.navigation = navigation;
    return () => {
      if (this.navigation === navigation) this.navigation = void 0;
    };
  }
  reload() {
    if (this.navigation === void 0) this.retry();
    else this.navigation.reload();
  }
  returnToChat() {
    if (this.navigation === void 0) this.retry();
    else this.navigation.returnToChat();
  }
  retry() {
    this.publish({ phase: "loading", retry: this.snapshot.retry + 1, outsideChat: false, navigating: false });
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
  navigating: "\u7F51\u9875\u52A0\u8F7D\u4E2D\u2026",
  failed: "\u65E0\u6CD5\u6253\u5F00 DeepSeek Chat\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  timedOut: "\u6253\u5F00 DeepSeek Chat \u8D85\u65F6\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002",
  retry: "\u91CD\u8BD5",
  reload: "\u91CD\u65B0\u52A0\u8F7D\u7F51\u9875",
  more: "\u66F4\u591A\u64CD\u4F5C",
  returnToChat: "\u56DE\u5230 Chat",
  clear: "\u672C\u5730\u767B\u5F55\u6570\u636E\u8BF4\u660E\u2026",
  clearHint: "\u5B8C\u6574\u9000\u51FA\u684C\u9762\u7AEF\u540E\u6E05\u9664",
  close: "\u5173\u95ED",
  restartClearTitle: "\u672C\u5730\u767B\u5F55\u6570\u636E\u8BF4\u660E",
  restartClearDescription: "\u8BF7\u9000\u51FA\u6240\u6709 Harness Desktop \u7A97\u53E3\u548C\u540E\u53F0\u8FDB\u7A0B\uFF0C\u7136\u540E\u91CD\u65B0\u6253\u5F00\u3002\u6B64\u63D2\u4EF6\u4F7F\u7528\u5185\u5B58\u5206\u533A\uFF1B\u5B8C\u6574\u9000\u51FA\u540E\uFF0C\u8BE5\u5206\u533A\u4E2D\u7684\u767B\u5F55\u72B6\u6001\u548C\u7AD9\u70B9\u5B58\u50A8\u4F1A\u6E05\u9664\u3002"
};
var en = {
  panel: "DeepSeek Chat",
  title: "DeepSeek Chat",
  back: "Back to Agent",
  loading: "Opening DeepSeek Chat\u2026",
  navigating: "Loading page\u2026",
  failed: "DeepSeek Chat could not open. Please try again.",
  timedOut: "Opening DeepSeek Chat timed out. Check your connection and retry.",
  retry: "Retry",
  reload: "Reload page",
  more: "More actions",
  returnToChat: "Return to Chat",
  clear: "Local login data\u2026",
  clearHint: "Cleared after fully quitting Desktop",
  close: "Close",
  restartClearTitle: "Local login data",
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
