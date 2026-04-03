import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    }
    return { user: context.user }
  },
  component: AuthedLayout,
})

function AuthedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
