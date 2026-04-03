import { useRouteContext, useNavigate } from '@tanstack/react-router'
import { LogOut, Menu, CheckSquare, Sun, Moon } from 'lucide-react'
import { logoutFn } from '@/server/auth'
import { Avatar } from '@/components/ui/Avatar'
import { useTheme } from '@/context/ThemeContext'
import { useState } from 'react'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useRouteContext({ from: '/_authed' })
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await logoutFn()
    navigate({ to: '/login' })
  }

  return (
    <header className="provisioners-glass h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-md hover:bg-surface-tertiary text-text-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] text-white">
            <CheckSquare className="h-4 w-4" />
          </div>
          <span className="font-semibold text-text-primary">ProVisioners</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-xl hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors duration-150"
        >
          {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 hover:bg-surface-tertiary rounded-xl px-2 py-1.5 transition-colors"
          >
            <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
            <span className="text-sm font-medium text-text-primary hidden sm:block">
              {user.fullName || user.email}
            </span>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="provisioners-glass absolute right-0 top-full mt-2 z-50 rounded-2xl py-1 w-56">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">{user.fullName}</p>
                  <p className="text-xs text-text-tertiary truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
