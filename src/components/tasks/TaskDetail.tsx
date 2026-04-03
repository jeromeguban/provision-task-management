import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Avatar } from "@/components/ui/Avatar";
import { addComment, deleteComment, getProjectMembers } from "@/server/tasks";
import {
  Calendar,
  Check,
  ChevronDown,
  MessageSquare,
  Send,
  Trash2,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import type {
  ProjectMemberWithUser,
  TaskCommentWithAuthor,
  TaskWithRelations,
} from "@/types";
import type { TaskPriority, TaskStatus } from "@prisma/client";

interface TaskDetailProps {
  task: TaskWithRelations;
  projectId: string;
  onUpdate: (data: {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string | null;
    assigneeId: string | null;
  }) => Promise<void>;
  onFieldUpdate: (
    taskId: string,
    data: {
      priority?: string;
      dueDate?: string | null;
      assigneeId?: string | null;
    },
  ) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onClose: () => void;
}

/* ── Config ─────────────────────────────────────────────── */

const STATUS_OPTIONS: {
  value: TaskStatus;
  label: string;
  dot: string;
  text: string;
  bg: string;
}[] = [
  {
    value: "BACKLOG",
    label: "Backlog",
    dot: "bg-slate-400",
    text: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
  {
    value: "TODO",
    label: "To Do",
    dot: "bg-violet-400",
    text: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-100 dark:bg-violet-900/50",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    dot: "bg-fuchsia-400",
    text: "text-fuchsia-700 dark:text-fuchsia-300",
    bg: "bg-fuchsia-100 dark:bg-fuchsia-900/50",
  },
  {
    value: "IN_REVIEW",
    label: "In Review",
    dot: "bg-cyan-400",
    text: "text-cyan-700 dark:text-cyan-300",
    bg: "bg-cyan-100 dark:bg-cyan-900/50",
  },
  {
    value: "DONE",
    label: "Done",
    dot: "bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-100 dark:bg-emerald-900/50",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    dot: "bg-rose-400",
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-100 dark:bg-rose-900/50",
  },
];

const PRIORITY_OPTIONS: {
  value: TaskPriority;
  label: string;
  dot: string;
  text: string;
}[] = [
  {
    value: "URGENT",
    label: "Urgent",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
  },
  {
    value: "HIGH",
    label: "High",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    dot: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-400",
  },
  {
    value: "LOW",
    label: "Low",
    dot: "bg-slate-400",
    text: "text-slate-500 dark:text-slate-400",
  },
  {
    value: "NONE",
    label: "No Priority",
    dot: "bg-border",
    text: "text-text-tertiary",
  },
];

/* ── PropDropdown ───────────────────────────────────────── */
// Portals the dropdown into document.body to escape the modal's backdrop-filter stacking context.
// Uses position:fixed viewport coords calculated from the trigger's getBoundingClientRect.

function PropDropdown({
  trigger,
  children,
}: {
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const estimatedDropH = 260;
      const estimatedDropW = 220;
      const spaceBelow = window.innerHeight - rect.bottom;

      // Flip upward when there's not enough space below
      const top =
        spaceBelow < estimatedDropH && rect.top > estimatedDropH
          ? rect.top - estimatedDropH - 4
          : rect.bottom + 4;

      // Left-align to trigger; right-align to trigger's right edge if it would overflow
      const left =
        rect.left + estimatedDropW > window.innerWidth
          ? Math.max(4, rect.right - estimatedDropW)
          : rect.left;

      setPos({ top, left });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    function onOut(e: MouseEvent) {
      const t = e.target as Node;
      if (!dropRef.current?.contains(t) && !triggerRef.current?.contains(t)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, [open]);

  const dropdown = open ? (
    <div
      ref={dropRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 99999 }}
      className="bg-surface border border-border rounded-xl shadow-xl py-1 min-w-[200px] animate-card-in"
    >
      {children(() => setOpen(false))}
    </div>
  ) : null;

  return (
    <div>
      <div ref={triggerRef} onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>
      {typeof document !== "undefined"
        ? createPortal(dropdown, document.body)
        : null}
    </div>
  );
}

function DropdownItem({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left transition-colors ${
        selected
          ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
          : "text-text-primary hover:bg-surface-tertiary"
      }`}
    >
      <div className="flex items-center gap-2">{children}</div>
      {selected && <Check className="h-3.5 w-3.5 shrink-0 text-primary-600" />}
    </button>
  );
}

function PropRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
      <span className="text-xs text-text-tertiary w-24 shrink-0">
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}


/* ── Main component ─────────────────────────────────────── */

export function TaskDetail({
  task,
  projectId,
  onUpdate,
  onFieldUpdate,
  onDelete,
  onStatusChange,
  onClose,
}: TaskDetailProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const isDirty =
    title !== task.title || description !== (task.description ?? "");

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<TaskCommentWithAuthor[]>(
    task.comments ?? [],
  );
  const [submittingComment, setSubmittingComment] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [members, setMembers] = useState<ProjectMemberWithUser[]>([]);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getProjectMembers({ data: { projectId } })
      .then(setMembers)
      .catch(() => {});
  }, [projectId]);

  // Sync when task changes (e.g. after status/property update)
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setComments(task.comments ?? []);
  }, [task.id]);

  // Resize textareas after mount and after task sync
  useLayoutEffect(() => {
    for (const ref of [titleRef, descRef]) {
      if (ref.current) {
        ref.current.style.height = "auto";
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
    }
  }, [task.id, title, description]);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleSaveContent = async () => {
    if (!title.trim()) return;
    setSavingContent(true);
    try {
      await onUpdate({
        title: title.trim(),
        description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : null,
        assigneeId: task.assigneeId ?? null,
      });
    } finally {
      setSavingContent(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      const newComment = await addComment({
        data: { taskId: task.id, content: comment },
      });
      setComments((c) => [...c, newComment]);
      setComment("");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ data: { commentId } });
      setComments((c) => c.filter((comment) => comment.id !== commentId));
    } catch {
      // Silently ignore — server will reject unauthorized deletes
    }
  };

  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === task.status) ?? STATUS_OPTIONS[0];
  const currentPriority =
    PRIORITY_OPTIONS.find((p) => p.value === task.priority) ??
    PRIORITY_OPTIONS[4];
  const currentDueDateValue = task.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : "";
  const currentAssignee = members.find((m) => m.userId === task.assigneeId);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* ── Left: Content ──────────────────────────────── */}
      <div className="flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-border">
        {/* Top bar: status pill + delete */}
        <div className="flex items-center justify-between gap-3 px-6 py-3 border-b border-border">
          <PropDropdown
            trigger={
              <div
                className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${currentStatus.bg} ${currentStatus.text}`}
              >
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${currentStatus.dot}`}
                />
                {currentStatus.label}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </div>
            }
          >
            {(close) =>
              STATUS_OPTIONS.map((s) => (
                <DropdownItem
                  key={s.value}
                  selected={task.status === s.value}
                  onClick={() => {
                    onStatusChange(task.id, s.value);
                    close();
                  }}
                >
                  <span className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
                  <span className={s.text}>{s.label}</span>
                </DropdownItem>
              ))
            }
          </PropDropdown>

          <button
            onClick={() => onDelete(task.id)}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>

        {/* Title */}
        <div className="px-6 pt-5 pb-1 group">
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              autoResize(e.target);
            }}
            placeholder="Task name"
            rows={1}
            className="w-full text-2xl font-bold text-text-primary bg-transparent border-0 outline-none resize-none leading-snug placeholder:text-text-tertiary/50 hover:bg-surface-secondary/60 focus:bg-surface-secondary/60 rounded-lg px-2 -mx-2 py-1 transition-colors"
            style={{ overflow: "hidden", minHeight: "2.5rem" }}
          />
        </div>

        {/* Description */}
        <div className="px-6 pb-4">
          <textarea
            ref={descRef}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              autoResize(e.target);
            }}
            placeholder="Add description…"
            rows={3}
            className="w-full text-sm text-text-secondary bg-transparent border-0 outline-none resize-none leading-relaxed placeholder:text-text-tertiary/50 hover:bg-surface-secondary/60 focus:bg-surface-secondary/60 rounded-lg px-2 -mx-2 py-1 transition-colors"
            style={{ overflow: "hidden", minHeight: "4.5rem" }}
          />
        </div>

        {/* Unsaved changes bar */}
        {isDirty && (
          <div className="mx-6 mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-tertiary border border-border text-xs">
            <span className="text-text-secondary flex-1">Unsaved changes</span>
            <button
              type="button"
              onClick={() => {
                setTitle(task.title);
                setDescription(task.description ?? "");
              }}
              className="px-2.5 py-1 rounded-md text-text-secondary hover:bg-surface transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSaveContent}
              disabled={savingContent || !title.trim()}
              className="px-2.5 py-1 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
            >
              {savingContent ? "Saving…" : "Save"}
            </button>
          </div>
        )}

        {/* Comments */}
        <div className="px-6 pb-6 border-t border-border pt-4">
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5 mb-4">
            <MessageSquare className="h-3.5 w-3.5" />
            Comments
            {comments.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface-tertiary text-text-secondary font-normal normal-case tracking-normal">
                {comments.length}
              </span>
            )}
          </h4>

          <div className="space-y-4 mb-4">
            {comments.length === 0 && (
              <p className="text-xs text-text-tertiary italic">
                No comments yet.
              </p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3 group">
                <Avatar
                  name={c.author.fullName}
                  src={c.author.avatarUrl}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-text-primary">
                      {c.author.fullName ?? c.author.email}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(c.id)}
                      title="Delete comment"
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-text-tertiary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="bg-surface-tertiary rounded-xl px-3 py-2 text-sm text-text-secondary">
                    {c.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface text-text-primary placeholder:text-text-tertiary"
            />
            <button
              type="submit"
              disabled={!comment.trim() || submittingComment}
              className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ── Right: Properties ─────────────────────────── */}
      <div className="w-full lg:w-64 xl:w-72 shrink-0 px-5 py-4">
        <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">
          Properties
        </p>

        {/* Status */}
        <PropRow label="Status">
          <PropDropdown
            trigger={
              <div
                className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${currentStatus.bg} ${currentStatus.text}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${currentStatus.dot}`}
                />
                {currentStatus.label}
              </div>
            }
          >
            {(close) =>
              STATUS_OPTIONS.map((s) => (
                <DropdownItem
                  key={s.value}
                  selected={task.status === s.value}
                  onClick={() => {
                    onStatusChange(task.id, s.value);
                    close();
                  }}
                >
                  <span className={`h-2 w-2 rounded-full shrink-0 ${s.dot}`} />
                  <span className={s.text}>{s.label}</span>
                </DropdownItem>
              ))
            }
          </PropDropdown>
        </PropRow>

        {/* Priority */}
        <PropRow label="Priority">
          <PropDropdown
            trigger={
              <div
                className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-xs font-medium cursor-pointer hover:bg-surface-tertiary transition-colors ${currentPriority.text}`}
              >
                <Zap className="h-3 w-3 shrink-0" />
                {currentPriority.label}
              </div>
            }
          >
            {(close) =>
              PRIORITY_OPTIONS.map((p) => (
                <DropdownItem
                  key={p.value}
                  selected={task.priority === p.value}
                  onClick={() => {
                    onFieldUpdate(task.id, { priority: p.value });
                    close();
                  }}
                >
                  <span className={`h-2 w-2 rounded-full shrink-0 ${p.dot}`} />
                  <span className={p.text}>{p.label}</span>
                </DropdownItem>
              ))
            }
          </PropDropdown>
        </PropRow>

        {/* Assignee */}
        <PropRow label="Assignee">
          <PropDropdown
            trigger={
              <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-xs cursor-pointer hover:bg-surface-tertiary transition-colors text-text-secondary">
                {task.assignee ? (
                  <>
                    <Avatar
                      name={task.assignee.fullName}
                      src={task.assignee.avatarUrl}
                      size="sm"
                    />
                    <span className="text-text-primary truncate max-w-[110px]">
                      {task.assignee.fullName ?? task.assignee.email}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-5 w-5 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center shrink-0">
                      <UserRound className="h-3 w-3 text-text-tertiary" />
                    </div>
                    <span className="text-text-tertiary">Unassigned</span>
                  </>
                )}
              </div>
            }
          >
            {(close) => (
              <>
                <DropdownItem
                  selected={!task.assigneeId}
                  onClick={() => {
                    onFieldUpdate(task.id, { assigneeId: null });
                    close();
                  }}
                >
                  <div className="h-5 w-5 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center shrink-0">
                    <UserRound className="h-3 w-3 text-text-tertiary" />
                  </div>
                  <span className="text-text-secondary">Unassigned</span>
                </DropdownItem>
                {members.map((m) => (
                  <DropdownItem
                    key={m.userId}
                    selected={task.assigneeId === m.userId}
                    onClick={() => {
                      onFieldUpdate(task.id, { assigneeId: m.userId });
                      close();
                    }}
                  >
                    <Avatar
                      name={m.user.fullName}
                      src={m.user.avatarUrl}
                      size="sm"
                    />
                    <span>{m.user.fullName ?? m.user.email}</span>
                  </DropdownItem>
                ))}
              </>
            )}
          </PropDropdown>
        </PropRow>

        {/* Due date — real visible date input inside dropdown */}
        <PropRow label="Due date">
          <PropDropdown
            trigger={
              <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-xs cursor-pointer hover:bg-surface-tertiary transition-colors text-text-secondary">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span
                  className={
                    currentDueDateValue
                      ? "text-text-primary"
                      : "text-text-tertiary"
                  }
                >
                  {currentDueDateValue
                    ? new Date(
                        currentDueDateValue + "T00:00:00",
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Set due date"}
                </span>
              </div>
            }
          >
            {(close) => (
              <div className="p-3 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary px-1">
                  Due date
                </p>
                <input
                  type="date"
                  value={currentDueDateValue}
                  onChange={(e) => {
                    onFieldUpdate(task.id, { dueDate: e.target.value || null });
                    close();
                  }}
                  className="w-full px-3 py-1.5 border border-border rounded-lg text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                />
                {currentDueDateValue && (
                  <button
                    type="button"
                    onClick={() => {
                      onFieldUpdate(task.id, { dueDate: null });
                      close();
                    }}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <X className="h-3 w-3" /> Clear date
                  </button>
                )}
              </div>
            )}
          </PropDropdown>
        </PropRow>

        {/* Creator */}
        <PropRow label="Created by">
          <div className="inline-flex items-center gap-1.5 text-xs text-text-secondary px-2">
            <Avatar
              name={task.creator.fullName}
              src={task.creator.avatarUrl}
              size="sm"
            />
            <span>{task.creator.fullName ?? task.creator.email}</span>
          </div>
        </PropRow>

        {/* Created at */}
        <PropRow label="Created">
          <span className="inline-block text-xs text-text-secondary px-2">
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </PropRow>
      </div>
    </div>
  );
}
