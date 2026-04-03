import { createFileRoute } from '@tanstack/react-router'
import { getDashboardStats } from '@/server/dashboard'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  FolderKanban,
  ListTodo,
  Plus,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
  loader: () => getDashboardStats(),
  component: DashboardPage,
})

function DashboardPage() {
  const stats = Route.useLoaderData()
  const completionRate =
    stats.totalTasks === 0 ? 0 : Math.round((stats.completedTasks / stats.totalTasks) * 100)
  const activeTasks = stats.totalTasks - stats.completedTasks

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="border-primary-100 bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(236,72,153,0.08)_55%,rgba(255,255,255,0.7))]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="primary">Workspace Overview</Badge>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
              <p className="mt-1 text-text-secondary">
                Track delivery, spot blockers, and jump back into active work.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-tertiary"
            >
              <FolderKanban className="h-4 w-4" />
              View Projects
            </Link>
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] px-4 py-2 text-sm font-medium text-white shadow-[0_18px_34px_rgba(168,85,247,0.24)] transition-all hover:shadow-[0_20px_38px_rgba(168,85,247,0.32)]"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-secondary">Completion Rate</p>
              <p className="mt-1 text-3xl font-bold text-text-primary">{completionRate}%</p>
            </div>
            <div className="rounded-full bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.12))] px-3 py-1 text-sm font-medium text-primary-700">
              {stats.completedTasks}/{stats.totalTasks} done
            </div>
          </div>

          <div className="h-3 rounded-full bg-surface-tertiary">
            <div
              className="h-3 rounded-full bg-primary-600 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <p className="text-sm text-text-secondary">
            {activeTasks} active tasks remain across {stats.totalProjects} projects.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-text-secondary">
            <ListTodo className="h-4 w-4" />
            <span className="text-sm font-medium">Focus Today</span>
          </div>
          <p className="text-sm text-text-secondary">
            Prioritize overdue work first, then clear tasks due within the next week.
          </p>
          <div className="flex items-center justify-between rounded-lg bg-surface-tertiary px-3 py-2">
            <span className="text-sm text-text-secondary">Overdue</span>
            <span className="text-sm font-semibold text-text-primary">{stats.overdueTasks}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-surface-tertiary px-3 py-2">
            <span className="text-sm text-text-secondary">Due soon</span>
            <span className="text-sm font-semibold text-text-primary">{stats.dueSoonTasks.length}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FolderKanban className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.totalProjects}</p>
              <p className="text-sm text-text-secondary">Projects</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fuchsia-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-fuchsia-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.totalTasks}</p>
              <p className="text-sm text-text-secondary">Total Tasks</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.completedTasks}</p>
              <p className="text-sm text-text-secondary">Completed</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <ListTodo className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{activeTasks}</p>
              <p className="text-sm text-text-secondary">Active Tasks</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stats.overdueTasks}</p>
              <p className="text-sm text-text-secondary">Overdue</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Clock className="h-5 w-5 text-text-tertiary" />
              Recent Tasks
            </h2>
          </div>
          <div className="divide-y divide-border">
            {stats.recentTasks.length === 0 ? (
              <p className="px-6 py-8 text-center text-text-tertiary">No tasks yet</p>
            ) : (
              stats.recentTasks.map((task: (typeof stats.recentTasks)[number]) => (
                <Link
                  key={task.id}
                  to="/projects/$projectId"
                  params={{ projectId: task.projectId }}
                  className="flex items-center justify-between px-6 py-3 hover:bg-surface-tertiary transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
                    <p className="text-xs text-text-tertiary">{task.project.name}</p>
                  </div>
                  <Badge
                    variant={
                      task.status === 'DONE'
                        ? 'success'
                        : task.status === 'IN_PROGRESS'
                          ? 'info'
                          : 'default'
                    }
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </Card>

        {/* Due Soon */}
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-text-tertiary" />
              Due Soon
            </h2>
          </div>
          <div className="divide-y divide-border">
            {stats.dueSoonTasks.length === 0 ? (
              <p className="px-6 py-8 text-center text-text-tertiary">No upcoming deadlines</p>
            ) : (
              stats.dueSoonTasks.map((task: (typeof stats.dueSoonTasks)[number]) => (
                <Link
                  key={task.id}
                  to="/projects/$projectId"
                  params={{ projectId: task.projectId }}
                  className="flex items-center justify-between px-6 py-3 hover:bg-surface-tertiary transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
                    <p className="text-xs text-text-tertiary">{task.project.name}</p>
                  </div>
                  <span className="text-xs text-text-secondary whitespace-nowrap ml-2">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
                  </span>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Need a fuller view?</h2>
          <p className="text-sm text-text-secondary">
            Open your projects to manage tasks, assignees, and project members.
          </p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-800"
        >
          Go to Projects
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  )
}
