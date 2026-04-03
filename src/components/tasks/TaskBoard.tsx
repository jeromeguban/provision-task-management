import { useEffect, useState, type DragEvent } from 'react'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { TaskDetail } from './TaskDetail'
import { Modal } from '@/components/ui/Modal'
import { GripVertical, Plus } from 'lucide-react'
import { createTask, deleteTask, getTask, moveTask, updateTask } from '@/server/tasks'
import type { TaskWithRelations } from '@/types'
import type { TaskPriority, TaskStatus } from '@/generated/prisma/client'

interface TaskBoardProps {
  projectId: string
  tasks: TaskWithRelations[]
  onRefresh: () => Promise<void>
  onTasksChange: (tasks: TaskWithRelations[]) => void
  dragDisabled?: boolean
}

const COLUMNS: { status: TaskStatus; label: string; color: string; dragOver: string }[] = [
  { status: 'BACKLOG',     label: 'Backlog',     color: 'bg-slate-400',   dragOver: 'bg-slate-100/60   dark:bg-slate-800/40' },
  { status: 'TODO',        label: 'To Do',       color: 'bg-violet-400',  dragOver: 'bg-violet-100/60  dark:bg-violet-950/40' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'bg-fuchsia-400', dragOver: 'bg-fuchsia-100/60 dark:bg-fuchsia-950/40' },
  { status: 'IN_REVIEW',   label: 'In Review',   color: 'bg-cyan-400',    dragOver: 'bg-cyan-100/60    dark:bg-cyan-950/40' },
  { status: 'DONE',        label: 'Done',        color: 'bg-emerald-400', dragOver: 'bg-emerald-100/60 dark:bg-emerald-950/40' },
  { status: 'CANCELLED',   label: 'Cancelled',   color: 'bg-rose-400',    dragOver: 'bg-rose-100/60    dark:bg-rose-950/40' },
]

function clampIndex(index: number, max: number) {
  return Math.max(0, Math.min(index, max))
}

function reorderTasks(
  tasks: TaskWithRelations[],
  taskId: string,
  targetStatus: TaskStatus,
  targetIndex: number,
) {
  const movingTask = tasks.find((task) => task.id === taskId)
  if (!movingTask) return tasks

  const buckets = Object.fromEntries(
    COLUMNS.map((column) => [
      column.status,
      tasks.filter((task) => task.status === column.status && task.id !== taskId),
    ]),
  ) as Record<TaskStatus, TaskWithRelations[]>

  const nextIndex = clampIndex(targetIndex, buckets[targetStatus].length)
  const movedTask =
    movingTask.status === targetStatus ? movingTask : { ...movingTask, status: targetStatus }

  buckets[targetStatus] = [
    ...buckets[targetStatus].slice(0, nextIndex),
    movedTask,
    ...buckets[targetStatus].slice(nextIndex),
  ].map((task, index) => ({
    ...task,
    position: index,
  }))

  if (movingTask.status !== targetStatus) {
    buckets[movingTask.status] = buckets[movingTask.status].map((task, index) => ({
      ...task,
      position: index,
    }))
  }

  return COLUMNS.flatMap((column) => buckets[column.status])
}

export function TaskBoard({
  projectId,
  tasks,
  onRefresh,
  onTasksChange,
  dragDisabled = false,
}: TaskBoardProps) {
  const [boardTasks, setBoardTasks] = useState(tasks)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createStatus, setCreateStatus] = useState<TaskStatus>('TODO')
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null)
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null)

  useEffect(() => {
    setBoardTasks(tasks)
  }, [tasks])

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
    const updatedTask = (await updateTask({
      data: { taskId, status: newStatus },
    })) as TaskWithRelations

    setSelectedTask((currentTask) =>
      currentTask && currentTask.id === updatedTask.id
        ? {
            ...currentTask,
            status: updatedTask.status,
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate,
            assignee: updatedTask.assignee,
            assigneeId: updatedTask.assigneeId,
            updatedAt: updatedTask.updatedAt,
          }
        : currentTask,
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

  const moveTaskPreview = (taskId: string, targetStatus: TaskStatus, targetIndex: number) => {
    setBoardTasks((currentTasks) => reorderTasks(currentTasks, taskId, targetStatus, targetIndex))
  }

  const handleDragStart = (event: DragEvent<HTMLDivElement>, taskId: string) => {
    if (dragDisabled) return

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
    setDraggedTaskId(taskId)
  }

  const handleCardDragOver = (
    event: DragEvent<HTMLDivElement>,
    targetTaskId: string,
    targetStatus: TaskStatus,
  ) => {
    if (dragDisabled) return

    const taskId = draggedTaskId ?? event.dataTransfer.getData('text/plain')
    if (!taskId) return

    event.preventDefault()
    event.stopPropagation()

    const columnTasks = boardTasks.filter((task) => task.status === targetStatus)
    const currentTargetIndex = columnTasks.findIndex((task) => task.id === targetTaskId)
    if (currentTargetIndex === -1) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const insertAfter = event.clientY - bounds.top > bounds.height / 2
    const nextIndex = currentTargetIndex + (insertAfter ? 1 : 0)

    moveTaskPreview(taskId, targetStatus, nextIndex)
  }

  const handleColumnDragOver = (event: DragEvent<HTMLDivElement>, targetStatus: TaskStatus) => {
    if (dragDisabled) return

    const taskId = draggedTaskId ?? event.dataTransfer.getData('text/plain')
    if (!taskId) return

    event.preventDefault()

    const nextIndex = boardTasks.filter((task) => task.status === targetStatus).length
    moveTaskPreview(taskId, targetStatus, nextIndex)
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    if (dragDisabled) return

    event.preventDefault()

    const taskId = draggedTaskId ?? event.dataTransfer.getData('text/plain')
    if (!taskId) return

    const nextTask = boardTasks.find((task) => task.id === taskId)
    const previousTask = tasks.find((task) => task.id === taskId)
    if (!nextTask || !previousTask) {
      setDraggedTaskId(null)
      return
    }

    const nextIndex = boardTasks
      .filter((task) => task.status === nextTask.status)
      .findIndex((task) => task.id === taskId)

    const previousIndex = tasks
      .filter((task) => task.status === previousTask.status)
      .findIndex((task) => task.id === taskId)
    const previousTasks = tasks
    const nextBoardTasks = boardTasks

    setDraggedTaskId(null)

    if (nextTask.status === previousTask.status && nextIndex === previousIndex) {
      setBoardTasks(tasks)
      return
    }

    setMovingTaskId(taskId)
    onTasksChange(nextBoardTasks)

    try {
      await moveTask({
        data: {
          taskId,
          targetStatus: nextTask.status,
          targetIndex: nextIndex,
        },
      })

      setSelectedTask((currentTask) =>
        currentTask && currentTask.id === taskId
          ? { ...currentTask, status: nextTask.status, position: nextIndex }
          : currentTask,
      )

      setMovingTaskId(null)
      void onRefresh().catch(() => {
        setBoardTasks(previousTasks)
        onTasksChange(previousTasks)
      })
    } catch {
      setBoardTasks(previousTasks)
      onTasksChange(previousTasks)
      setMovingTaskId(null)
    }
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnTasks = boardTasks.filter((task) => task.status === column.status)

          return (
            <div
              key={column.status}
              className="flex-shrink-0 w-72 flex flex-col bg-surface-tertiary rounded-xl transition-shadow duration-200"
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                  <span className="text-sm font-semibold text-text-primary">{column.label}</span>
                  <span className="text-xs text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {!dragDisabled && (
                    <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-text-tertiary">
                      <GripVertical className="h-3.5 w-3.5" />
                      Drag
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setCreateStatus(column.status)
                      setShowCreateModal(true)
                    }}
                    className="p-1 rounded hover:bg-surface text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div
                className={`kanban-column flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[100px] rounded-b-xl transition-colors duration-150 ${
                  draggedTaskId ? column.dragOver : ''
                }`}
                onDragOver={(event) => handleColumnDragOver(event, column.status)}
                onDrop={handleDrop}
              >
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    draggable={!dragDisabled}
                    onDragStart={(event) => handleDragStart(event, task.id)}
                    onDragEnd={() => {
                      setDraggedTaskId(null)
                    }}
                    onDragOver={(event) => handleCardDragOver(event, task.id, column.status)}
                    onDrop={handleDrop}
                    isDragging={task.id === draggedTaskId || task.id === movingTaskId}
                    onClick={() => {
                      if (draggedTaskId || movingTaskId) return
                      void handleSelectTask(task.id)
                    }}
                  />
                ))}

                {columnTasks.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border-strong px-3 py-6 text-center text-sm text-text-tertiary">
                    {dragDisabled ? 'No tasks in this column' : 'Drop a task here'}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {dragDisabled && (
        <p className="text-sm text-text-secondary">
          Clear the active filters to drag tasks between columns and reorder them.
        </p>
      )}

      {/* Create Task Modal */}
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

      {/* Task Detail Modal */}
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
