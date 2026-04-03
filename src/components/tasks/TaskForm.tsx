import { useState, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { Calendar, ChevronDown, UserRound, X, Zap } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { getProjectMembers } from '@/server/tasks'
import type { ProjectMemberWithUser } from '@/types'

interface TaskFormProps {
  projectId: string
  initialData?: {
    title?: string
    description?: string
    status?: string
    priority?: string
    dueDate?: string | null
    assigneeId?: string | null
  }
  onSubmit: (data: {
    title: string
    description: string
    status: string
    priority: string
    dueDate: string | null
    assigneeId: string | null
  }) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

const STATUS_OPTIONS = [
  { value: 'BACKLOG',     label: 'Backlog',     dot: 'bg-slate-400',   text: 'text-slate-600 dark:text-slate-400' },
  { value: 'TODO',        label: 'To Do',       dot: 'bg-violet-400',  text: 'text-violet-600 dark:text-violet-400' },
  { value: 'IN_PROGRESS', label: 'In Progress', dot: 'bg-fuchsia-400', text: 'text-fuchsia-600 dark:text-fuchsia-400' },
  { value: 'IN_REVIEW',   label: 'In Review',   dot: 'bg-cyan-400',    text: 'text-cyan-600 dark:text-cyan-400' },
  { value: 'DONE',        label: 'Done',        dot: 'bg-emerald-400', text: 'text-emerald-600 dark:text-emerald-400' },
  { value: 'CANCELLED',   label: 'Cancelled',   dot: 'bg-rose-400',    text: 'text-rose-600 dark:text-rose-400' },
]

const PRIORITY_OPTIONS = [
  { value: 'URGENT', label: 'Urgent',      dot: 'bg-rose-500',   text: 'text-rose-600 dark:text-rose-400' },
  { value: 'HIGH',   label: 'High',        dot: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-400' },
  { value: 'MEDIUM', label: 'Medium',      dot: 'bg-cyan-500',   text: 'text-cyan-600 dark:text-cyan-400' },
  { value: 'LOW',    label: 'Low',         dot: 'bg-slate-400',  text: 'text-slate-500 dark:text-slate-400' },
  { value: 'NONE',   label: 'No Priority', dot: 'bg-border',     text: 'text-text-tertiary' },
]

/* ── Pill Dropdown ──────────────────────────────────────── */

function PillDropdown({
  trigger,
  children,
}: {
  trigger: ReactNode
  children: (close: () => void) => ReactNode
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      const t = e.target as Node
      if (!dropRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  return (
    <div className="relative inline-flex">
      <div ref={triggerRef} onClick={() => setOpen((o) => !o)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          ref={dropRef}
          className="absolute bottom-full left-0 z-20 mb-2 max-h-64 min-w-[190px] overflow-y-auto rounded-xl border border-border bg-surface py-1 shadow-xl animate-card-in"
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

function DropdownItem({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
        selected
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
          : 'text-text-primary hover:bg-surface-tertiary'
      }`}
    >
      {children}
    </button>
  )
}

/* ── Main Component ─────────────────────────────────────── */

export function TaskForm({
  projectId,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Task',
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [status, setStatus] = useState(initialData?.status ?? 'TODO')
  const [priority, setPriority] = useState(initialData?.priority ?? 'NONE')
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
  )
  const [assigneeId, setAssigneeId] = useState(initialData?.assigneeId ?? '')
  const [members, setMembers] = useState<ProjectMemberWithUser[]>([])
  const [loading, setLoading] = useState(false)

  const titleRef = useRef<HTMLTextAreaElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    getProjectMembers({ data: { projectId } }).then(setMembers).catch(() => {})
  }, [projectId])

  // Focus title and resize both textareas after mount
  useLayoutEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto'
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`
      titleRef.current.focus()
    }
    if (descRef.current) {
      descRef.current.style.height = 'auto'
      descRef.current.style.height = `${descRef.current.scrollHeight}px`
    }
  }, [])

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        description,
        status,
        priority,
        dueDate: dueDate || null,
        assigneeId: assigneeId || null,
      })
    } finally {
      setLoading(false)
    }
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[1]
  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === priority) ?? PRIORITY_OPTIONS[4]
  const currentAssignee = members.find((m) => m.userId === assigneeId)

  const formattedDate = dueDate
    ? new Date(dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : ''

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      {/* Title */}
      <div className="px-6 pt-5 pb-2">
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => { setTitle(e.target.value); autoResize(e.target) }}
          placeholder="Task name"
          required
          rows={1}
          className="w-full text-xl font-semibold text-text-primary bg-transparent border-0 outline-none resize-none placeholder:text-text-tertiary/50 leading-snug"
          style={{ overflow: 'hidden', minHeight: '2rem' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); descRef.current?.focus() }
          }}
        />
      </div>

      {/* Description */}
      <div className="flex-1 px-6 pb-4">
        <textarea
          ref={descRef}
          id="task-description"
          value={description}
          onChange={(e) => { setDescription(e.target.value); autoResize(e.target) }}
          placeholder="Add description…"
          rows={3}
          className="w-full text-sm text-text-secondary bg-transparent border-0 outline-none resize-none placeholder:text-text-tertiary/50 leading-relaxed"
          style={{ overflow: 'hidden', minHeight: '5rem' }}
        />
      </div>

      {/* Property pills */}
      <div className="px-6 py-3 border-t border-border flex flex-wrap items-center gap-2">

        {/* Status */}
        <PillDropdown
          trigger={
            <div className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-surface-tertiary text-xs font-medium hover:border-border-strong transition-colors ${currentStatus.text}`}>
              <span className={`h-2 w-2 rounded-full shrink-0 ${currentStatus.dot}`} />
              {currentStatus.label}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </div>
          }
        >
          {(close) =>
            STATUS_OPTIONS.map((s) => (
              <DropdownItem key={s.value} selected={status === s.value} onClick={() => { setStatus(s.value); close() }}>
                <span className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
                <span className={s.text}>{s.label}</span>
              </DropdownItem>
            ))
          }
        </PillDropdown>

        {/* Priority */}
        <PillDropdown
          trigger={
            <div className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-surface-tertiary text-xs font-medium hover:border-border-strong transition-colors ${currentPriority.text}`}>
              <Zap className="h-3 w-3 shrink-0" />
              {currentPriority.value === 'NONE' ? 'Priority' : currentPriority.label}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </div>
          }
        >
          {(close) =>
            PRIORITY_OPTIONS.map((p) => (
              <DropdownItem key={p.value} selected={priority === p.value} onClick={() => { setPriority(p.value); close() }}>
                <span className={`h-2 w-2 rounded-full shrink-0 ${p.dot}`} />
                <span className={p.text}>{p.label}</span>
              </DropdownItem>
            ))
          }
        </PillDropdown>

        {/* Due date — dropdown with a real visible date input */}
        <PillDropdown
          trigger={
            <div className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-surface-tertiary text-xs font-medium hover:border-border-strong transition-colors ${dueDate ? 'text-text-primary' : 'text-text-tertiary'}`}>
              <Calendar className="h-3 w-3 shrink-0" />
              {formattedDate || 'Due date'}
              {dueDate && (
                <X
                  className="h-3 w-3 opacity-60 hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); setDueDate('') }}
                />
              )}
            </div>
          }
        >
          {(close) => (
            <div className="p-3 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary px-1">Due date</p>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => { setDueDate(e.target.value); close() }}
                className="w-full px-3 py-1.5 border border-border rounded-lg text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
              />
              {dueDate && (
                <button
                  type="button"
                  onClick={() => { setDueDate(''); close() }}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <X className="h-3 w-3" /> Clear date
                </button>
              )}
            </div>
          )}
        </PillDropdown>

        {/* Assignee */}
        <PillDropdown
          trigger={
            <div className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-surface-tertiary text-xs font-medium hover:border-border-strong transition-colors text-text-tertiary hover:text-text-primary">
              {currentAssignee ? (
                <>
                  <Avatar name={currentAssignee.user.fullName} src={currentAssignee.user.avatarUrl} size="sm" />
                  <span className="text-text-primary">{currentAssignee.user.fullName?.split(' ')[0] ?? currentAssignee.user.email}</span>
                </>
              ) : (
                <>
                  <UserRound className="h-3.5 w-3.5" />
                  Assignee
                </>
              )}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </div>
          }
        >
          {(close) => (
            <>
              <DropdownItem selected={assigneeId === ''} onClick={() => { setAssigneeId(''); close() }}>
                <div className="h-5 w-5 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center shrink-0">
                  <UserRound className="h-3 w-3 text-text-tertiary" />
                </div>
                <span className="text-text-secondary">Unassigned</span>
              </DropdownItem>
              {members.map((m) => (
                <DropdownItem key={m.userId} selected={assigneeId === m.userId} onClick={() => { setAssigneeId(m.userId); close() }}>
                  <Avatar name={m.user.fullName} src={m.user.avatarUrl} size="sm" />
                  <span>{m.user.fullName ?? m.user.email}</span>
                </DropdownItem>
              ))}
            </>
          )}
        </PillDropdown>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-8 px-4 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-tertiary transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="h-8 px-4 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
