import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { TaskForm } from './TaskForm'
import { TaskDetail } from './TaskDetail'
import { Calendar, ChevronDown, ChevronRight, MessageSquare, Plus } from 'lucide-react'
import { createTask, deleteTask, getTask, updateTask } from '@/server/tasks'
import type { TaskWithRelations } from '@/types'
import type { TaskPriority, TaskStatus } from '@prisma/client'

interface TaskListProps {
  projectId: string
  tasks: TaskWithRelations[]
  onRefresh: () => Promise<void>
  onTasksChange: (tasks: TaskWithRelations[]) => void
}

const GROUPS: { status: TaskStatus; label: string; dot: string; header: string; rowAccent: string }[] = [
  {
    status: 'BACKLOG',
    label: 'Backlog',
    dot: 'bg-slate-400',
    header: 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400',
    rowAccent: 'border-l-slate-300 dark:border-l-slate-600',
  },
  {
    status: 'TODO',
    label: 'To Do',
    dot: 'bg-violet-400',
    header: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400',
    rowAccent: 'border-l-violet-300 dark:border-l-violet-700',
  },
  {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    dot: 'bg-fuchsia-400',
    header: 'bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-400',
    rowAccent: 'border-l-fuchsia-300 dark:border-l-fuchsia-600',
  },
  {
    status: 'IN_REVIEW',
    label: 'In Review',
    dot: 'bg-cyan-400',
    header: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400',
    rowAccent: 'border-l-cyan-300 dark:border-l-cyan-700',
  },
  {
    status: 'DONE',
    label: 'Done',
    dot: 'bg-emerald-400',
    header: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
    rowAccent: 'border-l-emerald-300 dark:border-l-emerald-600',
  },
  {
    status: 'CANCELLED',
    label: 'Cancelled',
    dot: 'bg-rose-400',
    header: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    rowAccent: 'border-l-rose-300 dark:border-l-rose-700',
  },
]

const priorityConfig = {
  URGENT: { variant: 'danger' as const, label: 'Urgent' },
  HIGH:   { variant: 'warning' as const, label: 'High' },
  MEDIUM: { variant: 'info' as const, label: 'Medium' },
  LOW:    { variant: 'default' as const, label: 'Low' },
  NONE:   { variant: 'default' as const, label: '' },
}

export function TaskList({ projectId, tasks, onRefresh, onTasksChange }: TaskListProps) {
  const [collapsed, setCollapsed] = useState<Partial<Record<TaskStatus, boolean>>>({})
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createStatus, setCreateStatus] = useState<TaskStatus>('TODO')
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null)
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null)

  const toggleGroup = (status: TaskStatus) =>
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }))

  const handleCreate = async (data: {
    title: string
    description: string
    status: string
    priority: string
    dueDate: string | null
    assigneeId: string | null
  }) => {
    await createTask({
      data: {
        projectId,
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        dueDate: data.dueDate ?? undefined,
        assigneeId: data.assigneeId ?? undefined,
      },
    })
    setShowCreateModal(false)
    await onRefresh()
  }

  const handleUpdate = async (data: {
    title: string
    description: string
    status: string
    priority: string
    dueDate: string | null
    assigneeId: string | null
  }) => {
    if (!selectedTask) return
    const updated = (await updateTask({
      data: {
        taskId: selectedTask.id,
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        dueDate: data.dueDate,
        assigneeId: data.assigneeId,
      },
    })) as TaskWithRelations
    setSelectedTask((cur) =>
      cur?.id === updated.id
        ? {
            ...cur,
            title: updated.title,
            description: updated.description,
            status: updated.status,
            priority: updated.priority,
            dueDate: updated.dueDate,
            assignee: updated.assignee,
            assigneeId: updated.assigneeId,
          }
        : cur,
    )
    await onRefresh()
  }

  const handleFieldUpdate = async (
    taskId: string,
    data: { priority?: string; dueDate?: string | null; assigneeId?: string | null },
  ) => {
    const updated = (await updateTask({
      data: {
        taskId,
        priority: data.priority as TaskPriority | undefined,
        dueDate: data.dueDate,
        assigneeId: data.assigneeId,
      },
    })) as TaskWithRelations
    setSelectedTask((cur) =>
      cur?.id === taskId
        ? { ...cur, priority: updated.priority, dueDate: updated.dueDate, assignee: updated.assignee, assigneeId: updated.assigneeId }
        : cur,
    )
    await onRefresh()
  }

  const handleDelete = async (taskId: string) => {
    await deleteTask({ data: { taskId } })
    setSelectedTask(null)
    await onRefresh()
  }

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const updated = (await updateTask({ data: { taskId, status: newStatus } })) as TaskWithRelations
    setSelectedTask((cur) =>
      cur && cur.id === updated.id ? { ...cur, status: updated.status } : cur,
    )
    await onRefresh()
  }

  const handleSelectTask = async (taskId: string) => {
    setLoadingTaskId(taskId)
    try {
      const task = (await getTask({ data: { taskId } })) as TaskWithRelations
      setSelectedTask(task)
    } finally {
      setLoadingTaskId(null)
    }
  }

  return (
    <>
      <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-sm">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_140px_120px_110px_120px] gap-0 border-b border-border bg-surface-tertiary px-4 py-2.5 text-xs font-semibold text-text-tertiary uppercase tracking-wide">
          <span>Name</span>
          <span>Assignee</span>
          <span>Due date</span>
          <span>Priority</span>
          <span>Status</span>
        </div>

        {/* Status groups */}
        {GROUPS.map((group) => {
          const groupTasks = tasks.filter((t) => t.status === group.status)
          const isCollapsed = collapsed[group.status]

          return (
            <div key={group.status} className="border-b border-border last:border-b-0">
              {/* Group header */}
              <div
                className={`flex items-center justify-between px-4 py-2 cursor-pointer select-none ${group.header} transition-opacity`}
                onClick={() => toggleGroup(group.status)}
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? (
                    <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  )}
                  <div className={`h-2.5 w-2.5 rounded-full ${group.dot}`} />
                  <span className="text-sm font-semibold">{group.label}</span>
                  <span className="text-xs opacity-60 font-normal">{groupTasks.length}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCreateStatus(group.status)
                    setShowCreateModal(true)
                  }}
                  className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity px-2 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <Plus className="h-3 w-3" />
                  Add task
                </button>
              </div>

              {/* Rows */}
              {!isCollapsed && (
                <div>
                  {groupTasks.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-text-tertiary italic border-l-4 border-transparent ml-0">
                      No tasks in this group
                    </div>
                  ) : (
                    groupTasks.map((task) => {
                      const isOverdue =
                        task.dueDate &&
                        new Date(task.dueDate) < new Date() &&
                        task.status !== 'DONE' &&
                        task.status !== 'CANCELLED'
                      const isLoading = loadingTaskId === task.id

                      return (
                        <div
                          key={task.id}
                          onClick={() => handleSelectTask(task.id)}
                          className={`grid grid-cols-[1fr_140px_120px_110px_120px] gap-0 items-center px-4 py-2.5 border-l-4 ${group.rowAccent} border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-tertiary/60 dark:hover:bg-white/[0.03] transition-colors duration-100 ${
                            isLoading ? 'opacity-50' : ''
                          } ${task.status === 'CANCELLED' ? 'opacity-60' : ''}`}
                        >
                          {/* Name */}
                          <div className="flex items-center gap-2 min-w-0 pr-4">
                            <span
                              className={`text-sm text-text-primary truncate ${
                                task.status === 'CANCELLED' ? 'line-through text-text-tertiary' : ''
                              }`}
                            >
                              {task.title}
                            </span>
                            {task._count && task._count.comments > 0 && (
                              <span className="shrink-0 inline-flex items-center gap-0.5 text-xs text-text-tertiary">
                                <MessageSquare className="h-3 w-3" />
                                {task._count.comments}
                              </span>
                            )}
                          </div>

                          {/* Assignee */}
                          <div>
                            {task.assignee ? (
                              <div className="flex items-center gap-1.5">
                                <Avatar
                                  name={task.assignee.fullName}
                                  src={task.assignee.avatarUrl}
                                  size="sm"
                                />
                                <span className="text-xs text-text-secondary truncate max-w-[80px]">
                                  {task.assignee.fullName?.split(' ')[0] ?? task.assignee.email}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-text-tertiary">—</span>
                            )}
                          </div>

                          {/* Due date */}
                          <div>
                            {task.dueDate ? (
                              <span
                                className={`inline-flex items-center gap-1 text-xs ${
                                  isOverdue
                                    ? 'text-rose-500 font-medium'
                                    : 'text-text-secondary'
                                }`}
                              >
                                <Calendar className="h-3 w-3 shrink-0" />
                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            ) : (
                              <span className="text-xs text-text-tertiary">—</span>
                            )}
                          </div>

                          {/* Priority */}
                          <div>
                            {task.priority !== 'NONE' ? (
                              <Badge variant={priorityConfig[task.priority].variant}>
                                {priorityConfig[task.priority].label}
                              </Badge>
                            ) : (
                              <span className="text-xs text-text-tertiary">—</span>
                            )}
                          </div>

                          {/* Status */}
                          <div>
                            <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
                              <span className={`h-2 w-2 rounded-full shrink-0 ${group.dot}`} />
                              {group.label}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Create modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Task"
        size="lg"
        contentClassName="h-[36rem]"
      >
        <TaskForm
          projectId={projectId}
          initialData={{ status: createStatus }}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!selectedTask || !!loadingTaskId}
        onClose={() => {
          setSelectedTask(null)
          setLoadingTaskId(null)
        }}
        size="xl"
      >
        {loadingTaskId && !selectedTask ? (
          <div className="py-12 text-center text-sm text-text-secondary">Loading…</div>
        ) : null}
        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            projectId={projectId}
            onUpdate={handleUpdate}
            onFieldUpdate={handleFieldUpdate}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </Modal>
    </>
  )
}
