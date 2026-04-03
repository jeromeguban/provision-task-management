import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, ChevronDown, Search, UserRound, X, Zap } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'

export interface Member {
  user: {
    id: string
    fullName: string | null
    email: string
    avatarUrl?: string | null
  }
}

interface TaskFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  priorityFilter: string
  onPriorityChange: (value: string) => void
  assigneeFilter: string
  onAssigneeChange: (value: string) => void
  currentUserId: string
  members: Member[]
}

/* ── Data ─────────────────────────────────────────────────── */

const STATUS_OPTIONS = [
  { value: 'BACKLOG',     label: 'Backlog',     dot: 'bg-slate-400' },
  { value: 'TODO',        label: 'To Do',       dot: 'bg-violet-400' },
  { value: 'IN_PROGRESS', label: 'In Progress', dot: 'bg-fuchsia-400' },
  { value: 'IN_REVIEW',   label: 'In Review',   dot: 'bg-cyan-400' },
  { value: 'DONE',        label: 'Done',        dot: 'bg-emerald-400' },
  { value: 'CANCELLED',   label: 'Cancelled',   dot: 'bg-rose-400' },
]

const PRIORITY_OPTIONS = [
  { value: 'URGENT', label: 'Urgent',      bar: 'bg-rose-500' },
  { value: 'HIGH',   label: 'High',        bar: 'bg-amber-500' },
  { value: 'MEDIUM', label: 'Medium',      bar: 'bg-cyan-500' },
  { value: 'LOW',    label: 'Low',         bar: 'bg-slate-400' },
  { value: 'NONE',   label: 'No Priority', bar: 'bg-text-tertiary' },
]

/* ── FilterPill ───────────────────────────────────────────── */

interface FilterPillProps {
  label: string
  icon: ReactNode
  active: boolean
  onClear: () => void
  children: ReactNode
}

function FilterPill({ label, icon, active, onClear, children }: FilterPillProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const estimatedH = 300
      const top = window.innerHeight - rect.bottom < estimatedH && rect.top > estimatedH
        ? rect.top - estimatedH - 4
        : rect.bottom + 6
      setPos({ top, left: rect.left })
    }
    setOpen((o) => !o)
  }

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      const t = e.target as Node
      if (!dropRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  return (
    <div>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium transition-all duration-150 whitespace-nowrap ${
          active
            ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300'
            : 'bg-surface border-border text-text-secondary hover:border-border-strong hover:text-text-primary dark:hover:border-border-strong'
        }`}
      >
        <span className="opacity-70">{icon}</span>
        {label}
        {active ? (
          <X
            className="h-3 w-3 opacity-60 hover:opacity-100 shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
              setOpen(false)
            }}
          />
        ) : (
          <ChevronDown
            className={`h-3 w-3 opacity-50 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {open && (
        <div
          ref={dropRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
          className="min-w-[200px] bg-surface border border-border rounded-xl shadow-xl py-1 animate-card-in"
        >
          {children}
        </div>
      )}
    </div>
  )
}

/* ── DropdownItem ─────────────────────────────────────────── */

function DropdownItem({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-left transition-colors duration-100 ${
        selected
          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
          : 'text-text-primary hover:bg-surface-tertiary'
      }`}
    >
      {children}
      {selected && <Check className="h-3 w-3 shrink-0 text-primary-600 dark:text-primary-400" />}
    </button>
  )
}

function DropdownDivider() {
  return <div className="my-1 border-t border-border" />
}

function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
      {children}
    </p>
  )
}

/* ── Main component ───────────────────────────────────────── */

export function TaskFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  assigneeFilter,
  onAssigneeChange,
  currentUserId,
  members,
}: TaskFiltersProps) {
  const hasAnyFilter = !!(search || statusFilter || priorityFilter || assigneeFilter)

  const currentMember = members.find((m) => m.user.id === currentUserId)
  const otherMembers = members.filter((m) => m.user.id !== currentUserId)

  // Human-readable label for active assignee pill
  const assigneeLabel = (() => {
    if (!assigneeFilter) return 'Assignee'
    if (assigneeFilter === 'me') return 'Me'
    if (assigneeFilter === 'unassigned') return 'Unassigned'
    const found = members.find((m) => m.user.id === assigneeFilter)
    return found?.user.fullName?.split(' ')[0] ?? 'User'
  })()

  const statusLabel = (() => {
    if (!statusFilter) return 'Status'
    return STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label ?? 'Status'
  })()

  const priorityLabel = (() => {
    if (!priorityFilter) return 'Priority'
    return PRIORITY_OPTIONS.find((p) => p.value === priorityFilter)?.label ?? 'Priority'
  })()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative min-w-[220px] flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full h-8 pl-8 pr-3 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface text-text-primary placeholder:text-text-tertiary transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-border hidden sm:block" />

      {/* Me quick-filter */}
      <button
        onClick={() => onAssigneeChange(assigneeFilter === 'me' ? '' : 'me')}
        className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium transition-all duration-150 ${
          assigneeFilter === 'me'
            ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
            : 'bg-surface border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
        }`}
      >
        <UserRound className="h-3.5 w-3.5" />
        Me
      </button>

      {/* Assignee dropdown */}
      <FilterPill
        label={assigneeLabel}
        icon={<UserRound className="h-3.5 w-3.5" />}
        active={!!assigneeFilter}
        onClear={() => onAssigneeChange('')}
      >
        <DropdownLabel>Assignee</DropdownLabel>

        {/* Me */}
        {currentMember && (
          <DropdownItem
            selected={assigneeFilter === 'me'}
            onClick={() => {
              onAssigneeChange(assigneeFilter === 'me' ? '' : 'me')
            }}
          >
            <div className="flex items-center gap-2">
              <Avatar
                name={currentMember.user.fullName}
                src={currentMember.user.avatarUrl}
                size="sm"
              />
              <div>
                <span className="font-medium">{currentMember.user.fullName ?? currentMember.user.email}</span>
                <span className="ml-1.5 px-1 py-0.5 rounded text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 font-medium">
                  you
                </span>
              </div>
            </div>
          </DropdownItem>
        )}

        {otherMembers.length > 0 && (
          <>
            <DropdownDivider />
            {otherMembers.map((m) => (
              <DropdownItem
                key={m.user.id}
                selected={assigneeFilter === m.user.id}
                onClick={() => onAssigneeChange(assigneeFilter === m.user.id ? '' : m.user.id)}
              >
                <div className="flex items-center gap-2">
                  <Avatar name={m.user.fullName} src={m.user.avatarUrl} size="sm" />
                  <span>{m.user.fullName ?? m.user.email}</span>
                </div>
              </DropdownItem>
            ))}
          </>
        )}

        <DropdownDivider />
        <DropdownItem
          selected={assigneeFilter === 'unassigned'}
          onClick={() => onAssigneeChange(assigneeFilter === 'unassigned' ? '' : 'unassigned')}
        >
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center">
              <UserRound className="h-3.5 w-3.5 text-text-tertiary" />
            </div>
            <span className="text-text-secondary">No assignee</span>
          </div>
        </DropdownItem>
      </FilterPill>

      {/* Status dropdown */}
      <FilterPill
        label={statusLabel}
        icon={
          statusFilter ? (
            <span
              className={`h-2 w-2 rounded-full ${
                STATUS_OPTIONS.find((s) => s.value === statusFilter)?.dot ?? 'bg-text-tertiary'
              }`}
            />
          ) : (
            <span className="h-2 w-2 rounded-full border border-current opacity-50" />
          )
        }
        active={!!statusFilter}
        onClear={() => onStatusChange('')}
      >
        <DropdownLabel>Status</DropdownLabel>
        {STATUS_OPTIONS.map((s) => (
          <DropdownItem
            key={s.value}
            selected={statusFilter === s.value}
            onClick={() => onStatusChange(statusFilter === s.value ? '' : s.value)}
          >
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
              {s.label}
            </div>
          </DropdownItem>
        ))}
      </FilterPill>

      {/* Priority dropdown */}
      <FilterPill
        label={priorityLabel}
        icon={<Zap className="h-3.5 w-3.5" />}
        active={!!priorityFilter}
        onClear={() => onPriorityChange('')}
      >
        <DropdownLabel>Priority</DropdownLabel>
        {PRIORITY_OPTIONS.map((p) => (
          <DropdownItem
            key={p.value}
            selected={priorityFilter === p.value}
            onClick={() => onPriorityChange(priorityFilter === p.value ? '' : p.value)}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 items-end h-3.5">
                <span className={`w-1 rounded-sm ${p.bar} ${p.value === 'NONE' ? 'h-1 opacity-30' : p.value === 'LOW' ? 'h-1.5' : p.value === 'MEDIUM' ? 'h-2.5' : p.value === 'HIGH' ? 'h-3' : 'h-3.5'}`} />
                <span className={`w-1 rounded-sm ${p.bar} ${p.value === 'NONE' ? 'h-1 opacity-30' : p.value === 'LOW' ? 'h-2.5' : p.value === 'MEDIUM' ? 'h-2.5' : p.value === 'HIGH' ? 'h-3' : 'h-3.5'}`} />
                <span className={`w-1 rounded-sm ${p.bar} ${p.value === 'NONE' ? 'h-1 opacity-30' : p.value === 'LOW' ? 'h-2.5' : p.value === 'MEDIUM' ? 'h-2.5' : p.value === 'HIGH' ? 'h-3.5' : 'h-3.5'}`} />
              </div>
              {p.label}
            </div>
          </DropdownItem>
        ))}
      </FilterPill>

      {/* Clear all */}
      {hasAnyFilter && (
        <button
          onClick={() => {
            onSearchChange('')
            onStatusChange('')
            onPriorityChange('')
            onAssigneeChange('')
          }}
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Clear all
        </button>
      )}
    </div>
  )
}
