import type { DragEventHandler } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Calendar, MessageSquare } from 'lucide-react'
import type { TaskWithRelations } from '@/types'

interface TaskCardProps {
  task: TaskWithRelations
  onClick: () => void
  draggable?: boolean
  onDragStart?: DragEventHandler<HTMLDivElement>
  onDragEnd?: DragEventHandler<HTMLDivElement>
  onDragOver?: DragEventHandler<HTMLDivElement>
  onDrop?: DragEventHandler<HTMLDivElement>
  isDragging?: boolean
}

const priorityConfig = {
  URGENT: { variant: 'danger' as const, label: 'Urgent' },
  HIGH: { variant: 'warning' as const, label: 'High' },
  MEDIUM: { variant: 'info' as const, label: 'Medium' },
  LOW: { variant: 'default' as const, label: 'Low' },
  NONE: { variant: 'default' as const, label: '' },
}

const statusCardConfig = {
  BACKLOG: {
    bg: 'bg-slate-50 dark:bg-slate-800/40',
    border: 'border-slate-200 dark:border-slate-700',
    accent: 'border-l-slate-400 dark:border-l-slate-500',
    hover: 'hover:border-slate-300 hover:bg-slate-100/80 dark:hover:border-slate-600 dark:hover:bg-slate-800/70',
    titleHover: 'group-hover:text-slate-700 dark:group-hover:text-slate-300',
  },
  TODO: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-200 dark:border-violet-900',
    accent: 'border-l-violet-400 dark:border-l-violet-500',
    hover: 'hover:border-violet-300 hover:bg-violet-100/80 dark:hover:border-violet-700 dark:hover:bg-violet-950/60',
    titleHover: 'group-hover:text-violet-700 dark:group-hover:text-violet-400',
  },
  IN_PROGRESS: {
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    border: 'border-fuchsia-200 dark:border-fuchsia-900',
    accent: 'border-l-fuchsia-400 dark:border-l-fuchsia-500',
    hover: 'hover:border-fuchsia-300 hover:bg-fuchsia-100/80 dark:hover:border-fuchsia-700 dark:hover:bg-fuchsia-950/60',
    titleHover: 'group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-400',
  },
  IN_REVIEW: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    border: 'border-cyan-200 dark:border-cyan-900',
    accent: 'border-l-cyan-400 dark:border-l-cyan-500',
    hover: 'hover:border-cyan-300 hover:bg-cyan-100/80 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/60',
    titleHover: 'group-hover:text-cyan-700 dark:group-hover:text-cyan-400',
  },
  DONE: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-900',
    accent: 'border-l-emerald-400 dark:border-l-emerald-500',
    hover: 'hover:border-emerald-300 hover:bg-emerald-100/80 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/60',
    titleHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-400',
  },
  CANCELLED: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-900',
    accent: 'border-l-rose-300 dark:border-l-rose-600',
    hover: 'hover:border-rose-300 hover:bg-rose-100/80 dark:hover:border-rose-700 dark:hover:bg-rose-950/60',
    titleHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
  },
}

export function TaskCard({
  task,
  onClick,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging = false,
}: TaskCardProps) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'DONE' &&
    task.status !== 'CANCELLED'

  const statusStyle = statusCardConfig[task.status]

  return (
    <div
      draggable={draggable}
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={[
        'border border-l-4 rounded-lg p-3 transition-all duration-200 ease-out group animate-card-in',
        'hover:-translate-y-0.5 hover:shadow-md',
        statusStyle.bg,
        statusStyle.border,
        statusStyle.accent,
        statusStyle.hover,
        draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        isDragging ? 'opacity-40 scale-95 shadow-lg' : '',
        task.status === 'CANCELLED' ? 'opacity-75' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h4
        className={`text-sm font-medium text-text-primary transition-colors duration-150 line-clamp-2 ${statusStyle.titleHover} ${
          task.status === 'CANCELLED' ? 'line-through text-text-tertiary' : ''
        }`}
      >
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-text-tertiary mt-1 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center flex-wrap gap-1.5 mt-2">
        {task.priority !== 'NONE' && (
          <Badge variant={priorityConfig[task.priority].variant}>
            {priorityConfig[task.priority].label}
          </Badge>
        )}

        {task.dueDate && (
          <span
            className={`inline-flex items-center gap-1 text-xs ${
              isOverdue ? 'text-rose-500 font-medium' : 'text-text-tertiary'
            }`}
          >
            <Calendar className="h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}

        {task._count && task._count.comments > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
            <MessageSquare className="h-3 w-3" />
            {task._count.comments}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <div className="flex -space-x-1">
          {task.assignee && (
            <Avatar name={task.assignee.fullName} src={task.assignee.avatarUrl} size="sm" />
          )}
        </div>
      </div>
    </div>
  )
}
