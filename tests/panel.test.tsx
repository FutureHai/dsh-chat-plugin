// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { BrowserChatPanel, type BrowserChatPanelProps } from '../src/client/BrowserChatPanel.tsx'
import { BrowserChatSession } from '../src/client/BrowserChatSession.ts'
import { zh } from '../src/client/locales.ts'

vi.mock('@deepseek-ai/dsh-client-ui-primitives', () => ({
  Button: ({ children, variant: _variant, size: _size, ...props }: ButtonHTMLAttributes<HTMLButtonElement>
    & { variant?: string; size?: string }) => <button {...props}>{children}</button>,
  IconChevronLeftOutlineRegular: () => null,
  IconEllipsisOutlineRegular: () => null,
  IconInfoOutlineRegular: () => null,
  IconRefreshOutlineRegular: () => null,
  Tooltip: ({ children }: { children: ReactNode }) => children,
  Menu: ({ open, anchor, children }: { open: boolean; anchor: ReactNode; children: ReactNode }) => (
    <span>{anchor}{open && <div role="menu">{children}</div>}</span>
  ),
  MenuItemButton: ({ children, onSelect }: { children: ReactNode; onSelect: () => void }) => (
    <button type="button" role="menuitem" onClick={onSelect}>{children}</button>
  ),
  Modal: ({ open, title }: { open: boolean; title: string }) => open && <div role="dialog">{title}</div>,
}))

afterEach(cleanup)

it('offers retry while loading and page controls after an external navigation', () => {
  const session = new BrowserChatSession()
  const props = { session, back: vi.fn(), t: (key: keyof typeof zh) => zh[key] } as BrowserChatPanelProps
  render(<BrowserChatPanel {...props} />)
  fireEvent.click(screen.getByRole('button', { name: '重试' }))
  expect(session.getSnapshot().retry).toBe(1)

  const reload = vi.fn()
  const returnToChat = vi.fn()
  session.attachNavigation({ reload, returnToChat })
  act(() => { session.setOutsideChat(true); session.setPhase('ready') })
  fireEvent.click(screen.getByRole('button', { name: '回到 Chat' }))
  fireEvent.click(screen.getByRole('button', { name: '重新加载网页' }))
  expect(returnToChat).toHaveBeenCalledOnce()
  expect(reload).toHaveBeenCalledOnce()

  act(() => { session.setNavigating(true) })
  expect(screen.getByRole('status').textContent).toBe('网页加载中…')
  expect(screen.queryByText('正在打开 DeepSeek Chat…', { selector: 'p' })).toBeNull()
  expect(screen.getByRole('button', { name: '回到 Chat' }).hasAttribute('disabled')).toBe(true)
  expect(screen.getByRole('button', { name: '重新加载网页' }).hasAttribute('disabled')).toBe(true)
})

it('keeps the main header compact and moves local-login guidance into More actions', () => {
  const session = new BrowserChatSession()
  const back = vi.fn()
  const props = { session, back, t: (key: keyof typeof zh) => zh[key] } as BrowserChatPanelProps
  render(<BrowserChatPanel {...props} />)

  expect(screen.getByRole('heading', { name: 'DeepSeek Chat' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: '返回 Agent' }))
  expect(back).toHaveBeenCalledOnce()
  expect(screen.queryByRole('button', { name: '本地登录数据说明…' })).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: '更多操作' }))
  expect(screen.getByRole('menuitem', { name: /本地登录数据说明/ }).textContent)
    .toContain('完整退出桌面端后清除')
  fireEvent.click(screen.getByRole('menuitem', { name: /本地登录数据说明/ }))
  expect(screen.queryByRole('menu')).toBeNull()
  expect(screen.getByRole('dialog').textContent).toBe('本地登录数据说明')
})
