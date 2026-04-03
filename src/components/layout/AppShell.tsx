import { type ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ThemeProvider } from '@/context/ThemeContext'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ThemeProvider>
      <div className="provisioners-app-shell h-screen flex overflow-hidden bg-surface-secondary">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
