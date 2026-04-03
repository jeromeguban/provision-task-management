import { createFileRoute, getRouteApi, useRouteContext } from '@tanstack/react-router'
import { useDeferredValue, useEffect, useState } from 'react'
import { CheckCircle2, Clock3, Kanban, List, ListTodo, RefreshCcw } from 'lucide-react'
import { getTasksByProject } from '@/server/tasks'
import { TaskBoard } from '@/components/tasks/TaskBoard'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskFilters } from '@/components/tasks/TaskFilters'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { TaskWithRelations } from '@/types'

export const Route = createFileRoute('/_authed/projects/$projectId/')({
  loader: ({ params }) => getTasksByProject({ data: { projectId: params.projectId } }),
  component: ProjectBoardPage,
})

const projectRouteApi = getRouteApi('/_authed/projects/$projectId')

type ViewMode = 'board' | 'list'

function ProjectBoardPage() {
  const project = projectRouteApi.useLoaderData()
  const { user } = useRouteContext({ from: '/_authed' })
  const initialTasks = Route.useLoaderData() as TaskWithRelations[]
  const { projectId } = Route.useParams()

  const [tasks, setTasks] = useState(initialTasks)
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [assigneeFilter, setAssigneeFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('taskflow-view') as ViewMode) ?? 'board'
    }
    return 'board'
  })

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const setViewMode = (mode: ViewMode) => {
    setView(mode)
    localStorage.setItem('taskflow-view', mode)
  }

  const normalizedSearch = deferredSearch.trim().toLowerCase()

  const filteredTasks = tasks.filter((task) => {
    const haystack = `${task.title} ${task.description ?? ''}`.toLowerCase()
    const matchesSearch = normalizedSearch ? haystack.includes(normalizedSearch) : true
    const matchesStatus = statusFilter ? task.status === statusFilter : true
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true
    const matchesAssignee = (() => {
      if (!assigneeFilter) return true
      if (assigneeFilter === 'me') return task.assignee?.id === user.id
      if (assigneeFilter === 'unassigned') return task.assignee === null
      return task.assignee?.id === assigneeFilter
    })()
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const hasActiveFilters = Boolean(normalizedSearch || statusFilter || priorityFilter || assigneeFilter)

  const completedTasks = tasks.filter((t) => t.status === 'DONE').length
  const openTasks = tasks.filter((t) => !['DONE', 'CANCELLED'].includes(t.status)).length
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || ['DONE', 'CANCELLED'].includes(t.status)) return false
    return new Date(t.dueDate) < new Date()
  }).length
  const completionRate = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100)

  const refreshTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const nextTasks = (await getTasksByProject({ data: { projectId } })) as TaskWithRelations[]
      setTasks(nextTasks)
    } catch {
      setError('Unable to refresh tasks right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Project header card */}
      <Card className="border-primary-100 dark:border-primary-900/40 bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(236,72,153,0.08)_55%,rgba(255,255,255,0.7))] dark:from-primary-950/30 dark:via-surface dark:to-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{project.currentUserRole}</Badge>
              <Badge variant="default">{tasks.length} total tasks</Badge>
              {filteredTasks.length !== tasks.length && (
                <Badge variant="info">{filteredTasks.length} in view</Badge>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Task Board</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Plan work, track progress, and keep {project.name} moving.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="min-w-36">
              <div className="mb-1 flex items-center justify-between text-xs text-text-secondary">
                <span>Completion</span>
                <span>{completionRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-tertiary">
                <div
                  className="h-2 rounded-full bg-primary-600 transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <Button variant="secondary" onClick={refreshTasks} disabled={loading}>
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-text-secondary">
            <ListTodo className="h-4 w-4" />
            <span className="text-sm font-medium">Open Work</span>
          </div>
          <p className="text-3xl font-bold text-text-primary">{openTasks}</p>
          <p className="text-sm text-text-secondary">Tasks still in flight across the board.</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-text-secondary">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <p className="text-3xl font-bold text-text-primary">{completedTasks}</p>
          <p className="text-sm text-text-secondary">Finished tasks contributing to delivery.</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-text-secondary">
            <Clock3 className="h-4 w-4" />
            <span className="text-sm font-medium">Overdue</span>
          </div>
          <p className="text-3xl font-bold text-text-primary">{overdueTasks}</p>
          <p className="text-sm text-text-secondary">Open tasks that have passed their due date.</p>
        </Card>
      </div>

      {/* Filters + view toggle */}
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Filters</h3>
            {error && <p className="text-xs text-rose-500 mt-0.5">{error}</p>}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 bg-surface-tertiary rounded-lg p-1 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('board')}
              title="Board view"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                view === 'board'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List view"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                view === 'list'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
          </div>
        </div>

        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          assigneeFilter={assigneeFilter}
          onAssigneeChange={setAssigneeFilter}
          currentUserId={user.id}
          members={project.members}
        />
      </Card>

      {/* View */}
      {view === 'board' ? (
        <TaskBoard
          projectId={projectId}
          tasks={filteredTasks}
          onRefresh={refreshTasks}
          onTasksChange={setTasks}
          dragDisabled={hasActiveFilters}
        />
      ) : (
        <TaskList
          projectId={projectId}
          tasks={filteredTasks}
          onRefresh={refreshTasks}
          onTasksChange={setTasks}
        />
      )}
    </div>
  )
}
