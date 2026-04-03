import { e as Route$1, f as getTasksByProject, m as moveTask, h as getTask, i as getProjectMembers, j as createTask, u as updateTask, k as deleteTask, n as deleteComment, o as addComment } from './ssr.mjs';
import { A as Avatar } from './Avatar-BthGeKUX.mjs';
import { C as Card } from './Card-DjiraJzC.mjs';
import { B as Badge } from './Badge-BFOKyX8d.mjs';
import { B as Button } from './Button-C0IURiBx.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useRouteContext, getRouteApi } from '@tanstack/react-router';
import { useState, useDeferredValue, useEffect, useRef, useLayoutEffect } from 'react';
import { RefreshCcw, ListTodo, CheckCircle2, Clock3, Kanban, List, Search, X, UserRound, Zap, GripVertical, Plus, ChevronRight, ChevronDown, MessageSquare, Calendar, Check, Trash2, Send } from 'lucide-react';
import { createPortal } from 'react-dom';
import '@tanstack/router-core/ssr/client';
import '@tanstack/router-core';
import 'tiny-invariant';
import 'tiny-warning';
import 'node:async_hooks';
import '@supabase/ssr';
import 'vinxi/http';
import '@prisma/client';
import '@tanstack/react-router/ssr/server';
import '@tanstack/history';
import '@tanstack/router-core/ssr/server';

var priorityConfig$1 = {
  URGENT: {
    variant: "danger",
    label: "Urgent"
  },
  HIGH: {
    variant: "warning",
    label: "High"
  },
  MEDIUM: {
    variant: "info",
    label: "Medium"
  },
  LOW: {
    variant: "default",
    label: "Low"
  },
  NONE: {
    variant: "default",
    label: ""
  }
};
var statusCardConfig = {
  BACKLOG: {
    bg: "bg-slate-50 dark:bg-slate-800/40",
    border: "border-slate-200 dark:border-slate-700",
    accent: "border-l-slate-400 dark:border-l-slate-500",
    hover: "hover:border-slate-300 hover:bg-slate-100/80 dark:hover:border-slate-600 dark:hover:bg-slate-800/70",
    titleHover: "group-hover:text-slate-700 dark:group-hover:text-slate-300"
  },
  TODO: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200 dark:border-violet-900",
    accent: "border-l-violet-400 dark:border-l-violet-500",
    hover: "hover:border-violet-300 hover:bg-violet-100/80 dark:hover:border-violet-700 dark:hover:bg-violet-950/60",
    titleHover: "group-hover:text-violet-700 dark:group-hover:text-violet-400"
  },
  IN_PROGRESS: {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    border: "border-fuchsia-200 dark:border-fuchsia-900",
    accent: "border-l-fuchsia-400 dark:border-l-fuchsia-500",
    hover: "hover:border-fuchsia-300 hover:bg-fuchsia-100/80 dark:hover:border-fuchsia-700 dark:hover:bg-fuchsia-950/60",
    titleHover: "group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-400"
  },
  IN_REVIEW: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-200 dark:border-cyan-900",
    accent: "border-l-cyan-400 dark:border-l-cyan-500",
    hover: "hover:border-cyan-300 hover:bg-cyan-100/80 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/60",
    titleHover: "group-hover:text-cyan-700 dark:group-hover:text-cyan-400"
  },
  DONE: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-900",
    accent: "border-l-emerald-400 dark:border-l-emerald-500",
    hover: "hover:border-emerald-300 hover:bg-emerald-100/80 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/60",
    titleHover: "group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
  },
  CANCELLED: {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-900",
    accent: "border-l-rose-300 dark:border-l-rose-600",
    hover: "hover:border-rose-300 hover:bg-rose-100/80 dark:hover:border-rose-700 dark:hover:bg-rose-950/60",
    titleHover: "group-hover:text-rose-600 dark:group-hover:text-rose-400"
  }
};
function TaskCard({ task, onClick, draggable = false, onDragStart, onDragEnd, onDragOver, onDrop, isDragging = false }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < /* @__PURE__ */ new Date() && task.status !== "DONE" && task.status !== "CANCELLED";
  const statusStyle = statusCardConfig[task.status];
  return /* @__PURE__ */ jsxs("div", {
    draggable,
    onClick,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    className: [
      "border border-l-4 rounded-lg p-3 transition-all duration-200 ease-out group animate-card-in",
      "hover:-translate-y-0.5 hover:shadow-md",
      statusStyle.bg,
      statusStyle.border,
      statusStyle.accent,
      statusStyle.hover,
      draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
      isDragging ? "opacity-40 scale-95 shadow-lg" : "",
      task.status === "CANCELLED" ? "opacity-75" : ""
    ].filter(Boolean).join(" "),
    children: [
      /* @__PURE__ */ jsx("h4", {
        className: `text-sm font-medium text-text-primary transition-colors duration-150 line-clamp-2 ${statusStyle.titleHover} ${task.status === "CANCELLED" ? "line-through text-text-tertiary" : ""}`,
        children: task.title
      }),
      task.description && /* @__PURE__ */ jsx("p", {
        className: "text-xs text-text-tertiary mt-1 line-clamp-2",
        children: task.description
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "flex items-center flex-wrap gap-1.5 mt-2",
        children: [
          task.priority !== "NONE" && /* @__PURE__ */ jsx(Badge, {
            variant: priorityConfig$1[task.priority].variant,
            children: priorityConfig$1[task.priority].label
          }),
          task.dueDate && /* @__PURE__ */ jsxs("span", {
            className: `inline-flex items-center gap-1 text-xs ${isOverdue ? "text-rose-500 font-medium" : "text-text-tertiary"}`,
            children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }), new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            })]
          }),
          task._count && task._count.comments > 0 && /* @__PURE__ */ jsxs("span", {
            className: "inline-flex items-center gap-1 text-xs text-text-tertiary",
            children: [/* @__PURE__ */ jsx(MessageSquare, { className: "h-3 w-3" }), task._count.comments]
          })
        ]
      }),
      /* @__PURE__ */ jsx("div", {
        className: "flex items-center justify-between mt-2.5",
        children: /* @__PURE__ */ jsx("div", {
          className: "flex -space-x-1",
          children: task.assignee && /* @__PURE__ */ jsx(Avatar, {
            name: task.assignee.fullName,
            src: task.assignee.avatarUrl,
            size: "sm"
          })
        })
      })
    ]
  });
}
var STATUS_OPTIONS$2 = [
  {
    value: "BACKLOG",
    label: "Backlog",
    dot: "bg-slate-400",
    text: "text-slate-600 dark:text-slate-400"
  },
  {
    value: "TODO",
    label: "To Do",
    dot: "bg-violet-400",
    text: "text-violet-600 dark:text-violet-400"
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    dot: "bg-fuchsia-400",
    text: "text-fuchsia-600 dark:text-fuchsia-400"
  },
  {
    value: "IN_REVIEW",
    label: "In Review",
    dot: "bg-cyan-400",
    text: "text-cyan-600 dark:text-cyan-400"
  },
  {
    value: "DONE",
    label: "Done",
    dot: "bg-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400"
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    dot: "bg-rose-400",
    text: "text-rose-600 dark:text-rose-400"
  }
];
var PRIORITY_OPTIONS$2 = [
  {
    value: "URGENT",
    label: "Urgent",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400"
  },
  {
    value: "HIGH",
    label: "High",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400"
  },
  {
    value: "MEDIUM",
    label: "Medium",
    dot: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-400"
  },
  {
    value: "LOW",
    label: "Low",
    dot: "bg-slate-400",
    text: "text-slate-500 dark:text-slate-400"
  },
  {
    value: "NONE",
    label: "No Priority",
    dot: "bg-border",
    text: "text-text-tertiary"
  }
];
function PillDropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropRef = useRef(null);
  useEffect(() => {
    function onOutside(e) {
      var _a, _b;
      const t = e.target;
      if (!((_a = dropRef.current) == null ? void 0 : _a.contains(t)) && !((_b = triggerRef.current) == null ? void 0 : _b.contains(t))) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);
  return /* @__PURE__ */ jsxs("div", {
    className: "relative inline-flex",
    children: [/* @__PURE__ */ jsx("div", {
      ref: triggerRef,
      onClick: () => setOpen((o) => !o),
      className: "cursor-pointer",
      children: trigger
    }), open && /* @__PURE__ */ jsx("div", {
      ref: dropRef,
      className: "absolute bottom-full left-0 z-20 mb-2 max-h-64 min-w-[190px] overflow-y-auto rounded-xl border border-border bg-surface py-1 shadow-xl animate-card-in",
      children: children(() => setOpen(false))
    })]
  });
}
function DropdownItem$2({ selected, onClick, children }) {
  return /* @__PURE__ */ jsx("button", {
    type: "button",
    onClick,
    className: `w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${selected ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" : "text-text-primary hover:bg-surface-tertiary"}`,
    children
  });
}
function TaskForm({ projectId, initialData, onSubmit, onCancel, submitLabel = "Create Task" }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const [title, setTitle] = useState((_a = initialData == null ? void 0 : initialData.title) != null ? _a : "");
  const [description, setDescription] = useState((_b = initialData == null ? void 0 : initialData.description) != null ? _b : "");
  const [status, setStatus] = useState((_c = initialData == null ? void 0 : initialData.status) != null ? _c : "TODO");
  const [priority, setPriority] = useState((_d = initialData == null ? void 0 : initialData.priority) != null ? _d : "NONE");
  const [dueDate, setDueDate] = useState((initialData == null ? void 0 : initialData.dueDate) ? new Date(initialData.dueDate).toISOString().split("T")[0] : "");
  const [assigneeId, setAssigneeId] = useState((_e = initialData == null ? void 0 : initialData.assigneeId) != null ? _e : "");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  useEffect(() => {
    getProjectMembers({ data: { projectId } }).then(setMembers).catch(() => {
    });
  }, [projectId]);
  useLayoutEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
      titleRef.current.focus();
    }
    if (descRef.current) {
      descRef.current.style.height = "auto";
      descRef.current.style.height = `${descRef.current.scrollHeight}px`;
    }
  }, []);
  const autoResize = (el) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description,
        status,
        priority,
        dueDate: dueDate || null,
        assigneeId: assigneeId || null
      });
    } finally {
      setLoading(false);
    }
  };
  const currentStatus = (_f = STATUS_OPTIONS$2.find((s) => s.value === status)) != null ? _f : STATUS_OPTIONS$2[1];
  const currentPriority = (_g = PRIORITY_OPTIONS$2.find((p) => p.value === priority)) != null ? _g : PRIORITY_OPTIONS$2[4];
  const currentAssignee = members.find((m) => m.userId === assigneeId);
  const formattedDate = dueDate ? (/* @__PURE__ */ new Date(dueDate + "T00:00:00")).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  }) : "";
  return /* @__PURE__ */ jsxs("form", {
    onSubmit: handleSubmit,
    className: "flex h-full flex-col",
    children: [
      /* @__PURE__ */ jsx("div", {
        className: "px-6 pt-5 pb-2",
        children: /* @__PURE__ */ jsx("textarea", {
          ref: titleRef,
          value: title,
          onChange: (e) => {
            setTitle(e.target.value);
            autoResize(e.target);
          },
          placeholder: "Task name",
          required: true,
          rows: 1,
          className: "w-full text-xl font-semibold text-text-primary bg-transparent border-0 outline-none resize-none placeholder:text-text-tertiary/50 leading-snug",
          style: {
            overflow: "hidden",
            minHeight: "2rem"
          },
          onKeyDown: (e) => {
            var _a2;
            if (e.key === "Enter") {
              e.preventDefault();
              (_a2 = descRef.current) == null ? void 0 : _a2.focus();
            }
          }
        })
      }),
      /* @__PURE__ */ jsx("div", {
        className: "flex-1 px-6 pb-4",
        children: /* @__PURE__ */ jsx("textarea", {
          ref: descRef,
          id: "task-description",
          value: description,
          onChange: (e) => {
            setDescription(e.target.value);
            autoResize(e.target);
          },
          placeholder: "Add description\u2026",
          rows: 3,
          className: "w-full text-sm text-text-secondary bg-transparent border-0 outline-none resize-none placeholder:text-text-tertiary/50 leading-relaxed",
          style: {
            overflow: "hidden",
            minHeight: "5rem"
          }
        })
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "px-6 py-3 border-t border-border flex flex-wrap items-center gap-2",
        children: [
          /* @__PURE__ */ jsx(PillDropdown, {
            trigger: /* @__PURE__ */ jsxs("div", {
              className: `inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-surface-tertiary text-xs font-medium hover:border-border-strong transition-colors ${currentStatus.text}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full shrink-0 ${currentStatus.dot}` }),
                currentStatus.label,
                /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 opacity-50" })
              ]
            }),
            children: (close) => STATUS_OPTIONS$2.map((s) => /* @__PURE__ */ jsxs(DropdownItem$2, {
              selected: status === s.value,
              onClick: () => {
                setStatus(s.value);
                close();
              },
              children: [/* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full shrink-0 ${s.dot}` }), /* @__PURE__ */ jsx("span", {
                className: s.text,
                children: s.label
              })]
            }, s.value))
          }),
          /* @__PURE__ */ jsx(PillDropdown, {
            trigger: /* @__PURE__ */ jsxs("div", {
              className: `inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-surface-tertiary text-xs font-medium hover:border-border-strong transition-colors ${currentPriority.text}`,
              children: [
                /* @__PURE__ */ jsx(Zap, { className: "h-3 w-3 shrink-0" }),
                currentPriority.value === "NONE" ? "Priority" : currentPriority.label,
                /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 opacity-50" })
              ]
            }),
            children: (close) => PRIORITY_OPTIONS$2.map((p) => /* @__PURE__ */ jsxs(DropdownItem$2, {
              selected: priority === p.value,
              onClick: () => {
                setPriority(p.value);
                close();
              },
              children: [/* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full shrink-0 ${p.dot}` }), /* @__PURE__ */ jsx("span", {
                className: p.text,
                children: p.label
              })]
            }, p.value))
          }),
          /* @__PURE__ */ jsx(PillDropdown, {
            trigger: /* @__PURE__ */ jsxs("div", {
              className: `inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-surface-tertiary text-xs font-medium hover:border-border-strong transition-colors ${dueDate ? "text-text-primary" : "text-text-tertiary"}`,
              children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3 shrink-0" }),
                formattedDate || "Due date",
                dueDate && /* @__PURE__ */ jsx(X, {
                  className: "h-3 w-3 opacity-60 hover:opacity-100",
                  onClick: (e) => {
                    e.stopPropagation();
                    setDueDate("");
                  }
                })
              ]
            }),
            children: (close) => /* @__PURE__ */ jsxs("div", {
              className: "p-3 space-y-2",
              children: [
                /* @__PURE__ */ jsx("p", {
                  className: "text-[10px] font-semibold uppercase tracking-wider text-text-tertiary px-1",
                  children: "Due date"
                }),
                /* @__PURE__ */ jsx("input", {
                  type: "date",
                  value: dueDate,
                  onChange: (e) => {
                    setDueDate(e.target.value);
                    close();
                  },
                  className: "w-full px-3 py-1.5 border border-border rounded-lg text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                }),
                dueDate && /* @__PURE__ */ jsxs("button", {
                  type: "button",
                  onClick: () => {
                    setDueDate("");
                    close();
                  },
                  className: "w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors",
                  children: [/* @__PURE__ */ jsx(X, { className: "h-3 w-3" }), " Clear date"]
                })
              ]
            })
          }),
          /* @__PURE__ */ jsx(PillDropdown, {
            trigger: /* @__PURE__ */ jsxs("div", {
              className: "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border border-border bg-surface-tertiary text-xs font-medium hover:border-border-strong transition-colors text-text-tertiary hover:text-text-primary",
              children: [currentAssignee ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Avatar, {
                name: currentAssignee.user.fullName,
                src: currentAssignee.user.avatarUrl,
                size: "sm"
              }), /* @__PURE__ */ jsx("span", {
                className: "text-text-primary",
                children: (_i = (_h = currentAssignee.user.fullName) == null ? void 0 : _h.split(" ")[0]) != null ? _i : currentAssignee.user.email
              })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(UserRound, { className: "h-3.5 w-3.5" }), "Assignee"] }), /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 opacity-50" })]
            }),
            children: (close) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(DropdownItem$2, {
              selected: assigneeId === "",
              onClick: () => {
                setAssigneeId("");
                close();
              },
              children: [/* @__PURE__ */ jsx("div", {
                className: "h-5 w-5 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center shrink-0",
                children: /* @__PURE__ */ jsx(UserRound, { className: "h-3 w-3 text-text-tertiary" })
              }), /* @__PURE__ */ jsx("span", {
                className: "text-text-secondary",
                children: "Unassigned"
              })]
            }), members.map((m) => {
              var _a2;
              return /* @__PURE__ */ jsxs(DropdownItem$2, {
                selected: assigneeId === m.userId,
                onClick: () => {
                  setAssigneeId(m.userId);
                  close();
                },
                children: [/* @__PURE__ */ jsx(Avatar, {
                  name: m.user.fullName,
                  src: m.user.avatarUrl,
                  size: "sm"
                }), /* @__PURE__ */ jsx("span", { children: (_a2 = m.user.fullName) != null ? _a2 : m.user.email })]
              }, m.userId);
            })] })
          })
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "px-6 py-4 border-t border-border flex items-center justify-end gap-2",
        children: [/* @__PURE__ */ jsx("button", {
          type: "button",
          onClick: onCancel,
          className: "h-8 px-4 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-tertiary transition-colors",
          children: "Cancel"
        }), /* @__PURE__ */ jsx("button", {
          type: "submit",
          disabled: loading || !title.trim(),
          className: "h-8 px-4 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm",
          children: loading ? "Saving\u2026" : submitLabel
        })]
      })
    ]
  });
}
var STATUS_OPTIONS$1 = [
  {
    value: "BACKLOG",
    label: "Backlog",
    dot: "bg-slate-400",
    text: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800"
  },
  {
    value: "TODO",
    label: "To Do",
    dot: "bg-violet-400",
    text: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-100 dark:bg-violet-900/50"
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    dot: "bg-fuchsia-400",
    text: "text-fuchsia-700 dark:text-fuchsia-300",
    bg: "bg-fuchsia-100 dark:bg-fuchsia-900/50"
  },
  {
    value: "IN_REVIEW",
    label: "In Review",
    dot: "bg-cyan-400",
    text: "text-cyan-700 dark:text-cyan-300",
    bg: "bg-cyan-100 dark:bg-cyan-900/50"
  },
  {
    value: "DONE",
    label: "Done",
    dot: "bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-100 dark:bg-emerald-900/50"
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    dot: "bg-rose-400",
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-100 dark:bg-rose-900/50"
  }
];
var PRIORITY_OPTIONS$1 = [
  {
    value: "URGENT",
    label: "Urgent",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400"
  },
  {
    value: "HIGH",
    label: "High",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400"
  },
  {
    value: "MEDIUM",
    label: "Medium",
    dot: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-400"
  },
  {
    value: "LOW",
    label: "Low",
    dot: "bg-slate-400",
    text: "text-slate-500 dark:text-slate-400"
  },
  {
    value: "NONE",
    label: "No Priority",
    dot: "bg-border",
    text: "text-text-tertiary"
  }
];
function PropDropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({
    top: 0,
    left: 0
  });
  const triggerRef = useRef(null);
  const dropRef = useRef(null);
  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const estimatedDropH = 260;
      const estimatedDropW = 220;
      setPos({
        top: window.innerHeight - rect.bottom < estimatedDropH && rect.top > estimatedDropH ? rect.top - estimatedDropH - 4 : rect.bottom + 4,
        left: rect.left + estimatedDropW > window.innerWidth ? Math.max(4, rect.right - estimatedDropW) : rect.left
      });
    }
    setOpen((o) => !o);
  };
  useEffect(() => {
    function onOut(e) {
      var _a, _b;
      const t = e.target;
      if (!((_a = dropRef.current) == null ? void 0 : _a.contains(t)) && !((_b = triggerRef.current) == null ? void 0 : _b.contains(t))) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, [open]);
  const dropdown = open ? /* @__PURE__ */ jsx("div", {
    ref: dropRef,
    style: {
      position: "fixed",
      top: pos.top,
      left: pos.left,
      zIndex: 99999
    },
    className: "bg-surface border border-border rounded-xl shadow-xl py-1 min-w-[200px] animate-card-in",
    children: children(() => setOpen(false))
  }) : null;
  return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
    ref: triggerRef,
    onClick: handleToggle,
    className: "cursor-pointer",
    children: trigger
  }), typeof document !== "undefined" ? createPortal(dropdown, document.body) : null] });
}
function DropdownItem$1({ selected, onClick, children }) {
  return /* @__PURE__ */ jsxs("button", {
    type: "button",
    onClick,
    className: `w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left transition-colors ${selected ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300" : "text-text-primary hover:bg-surface-tertiary"}`,
    children: [/* @__PURE__ */ jsx("div", {
      className: "flex items-center gap-2",
      children
    }), selected && /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 shrink-0 text-primary-600" })]
  });
}
function PropRow({ label, children }) {
  return /* @__PURE__ */ jsxs("div", {
    className: "flex items-center gap-3 py-2 border-b border-border last:border-0",
    children: [/* @__PURE__ */ jsx("span", {
      className: "text-xs text-text-tertiary w-24 shrink-0",
      children: label
    }), /* @__PURE__ */ jsx("div", {
      className: "flex-1 min-w-0",
      children
    })]
  });
}
function TaskDetail({ task, projectId, onUpdate, onFieldUpdate, onDelete, onStatusChange, onClose }) {
  var _a, _b, _c, _d, _e, _f, _g;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState((_a = task.description) != null ? _a : "");
  const isDirty = title !== task.title || description !== ((_b = task.description) != null ? _b : "");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState((_c = task.comments) != null ? _c : []);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [members, setMembers] = useState([]);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  useEffect(() => {
    getProjectMembers({ data: { projectId } }).then(setMembers).catch(() => {
    });
  }, [projectId]);
  useEffect(() => {
    var _a2, _b2;
    setTitle(task.title);
    setDescription((_a2 = task.description) != null ? _a2 : "");
    setComments((_b2 = task.comments) != null ? _b2 : []);
  }, [task.id]);
  useLayoutEffect(() => {
    for (const ref of [titleRef, descRef]) if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [
    task.id,
    title,
    description
  ]);
  const autoResize = (el) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  const handleSaveContent = async () => {
    var _a2;
    if (!title.trim()) return;
    setSavingContent(true);
    try {
      await onUpdate({
        title: title.trim(),
        description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : null,
        assigneeId: (_a2 = task.assigneeId) != null ? _a2 : null
      });
    } finally {
      setSavingContent(false);
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      const newComment = await addComment({ data: {
        taskId: task.id,
        content: comment
      } });
      setComments((c) => [...c, newComment]);
      setComment("");
    } finally {
      setSubmittingComment(false);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ data: { commentId } });
      setComments((c) => c.filter((comment2) => comment2.id !== commentId));
    } catch {
    }
  };
  const currentStatus = (_d = STATUS_OPTIONS$1.find((s) => s.value === task.status)) != null ? _d : STATUS_OPTIONS$1[0];
  const currentPriority = (_e = PRIORITY_OPTIONS$1.find((p) => p.value === task.priority)) != null ? _e : PRIORITY_OPTIONS$1[4];
  const currentDueDateValue = task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "";
  members.find((m) => m.userId === task.assigneeId);
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col lg:flex-row",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-border",
      children: [
        /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between gap-3 px-6 py-3 border-b border-border",
          children: [/* @__PURE__ */ jsx(PropDropdown, {
            trigger: /* @__PURE__ */ jsxs("div", {
              className: `inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${currentStatus.bg} ${currentStatus.text}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full shrink-0 ${currentStatus.dot}` }),
                currentStatus.label,
                /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 opacity-60" })
              ]
            }),
            children: (close) => STATUS_OPTIONS$1.map((s) => /* @__PURE__ */ jsxs(DropdownItem$1, {
              selected: task.status === s.value,
              onClick: () => {
                onStatusChange(task.id, s.value);
                close();
              },
              children: [/* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full shrink-0 ${s.dot}` }), /* @__PURE__ */ jsx("span", {
                className: s.text,
                children: s.label
              })]
            }, s.value))
          }), /* @__PURE__ */ jsxs("button", {
            onClick: () => onDelete(task.id),
            className: "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors",
            children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }), "Delete"]
          })]
        }),
        /* @__PURE__ */ jsx("div", {
          className: "px-6 pt-5 pb-1 group",
          children: /* @__PURE__ */ jsx("textarea", {
            ref: titleRef,
            value: title,
            onChange: (e) => {
              setTitle(e.target.value);
              autoResize(e.target);
            },
            placeholder: "Task name",
            rows: 1,
            className: "w-full text-2xl font-bold text-text-primary bg-transparent border-0 outline-none resize-none leading-snug placeholder:text-text-tertiary/50 hover:bg-surface-secondary/60 focus:bg-surface-secondary/60 rounded-lg px-2 -mx-2 py-1 transition-colors",
            style: {
              overflow: "hidden",
              minHeight: "2.5rem"
            }
          })
        }),
        /* @__PURE__ */ jsx("div", {
          className: "px-6 pb-4",
          children: /* @__PURE__ */ jsx("textarea", {
            ref: descRef,
            value: description,
            onChange: (e) => {
              setDescription(e.target.value);
              autoResize(e.target);
            },
            placeholder: "Add description\u2026",
            rows: 3,
            className: "w-full text-sm text-text-secondary bg-transparent border-0 outline-none resize-none leading-relaxed placeholder:text-text-tertiary/50 hover:bg-surface-secondary/60 focus:bg-surface-secondary/60 rounded-lg px-2 -mx-2 py-1 transition-colors",
            style: {
              overflow: "hidden",
              minHeight: "4.5rem"
            }
          })
        }),
        isDirty && /* @__PURE__ */ jsxs("div", {
          className: "mx-6 mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-tertiary border border-border text-xs",
          children: [
            /* @__PURE__ */ jsx("span", {
              className: "text-text-secondary flex-1",
              children: "Unsaved changes"
            }),
            /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => {
                var _a2;
                setTitle(task.title);
                setDescription((_a2 = task.description) != null ? _a2 : "");
              },
              className: "px-2.5 py-1 rounded-md text-text-secondary hover:bg-surface transition-colors",
              children: "Discard"
            }),
            /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: handleSaveContent,
              disabled: savingContent || !title.trim(),
              className: "px-2.5 py-1 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium",
              children: savingContent ? "Saving\u2026" : "Save"
            })
          ]
        }),
        /* @__PURE__ */ jsxs("div", {
          className: "px-6 pb-6 border-t border-border pt-4",
          children: [
            /* @__PURE__ */ jsxs("h4", {
              className: "text-xs font-semibold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5 mb-4",
              children: [
                /* @__PURE__ */ jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
                "Comments",
                comments.length > 0 && /* @__PURE__ */ jsx("span", {
                  className: "ml-1 px-1.5 py-0.5 rounded-full bg-surface-tertiary text-text-secondary font-normal normal-case tracking-normal",
                  children: comments.length
                })
              ]
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "space-y-4 mb-4",
              children: [comments.length === 0 && /* @__PURE__ */ jsx("p", {
                className: "text-xs text-text-tertiary italic",
                children: "No comments yet."
              }), comments.map((c) => {
                var _a2;
                return /* @__PURE__ */ jsxs("div", {
                  className: "flex gap-3 group",
                  children: [/* @__PURE__ */ jsx(Avatar, {
                    name: c.author.fullName,
                    src: c.author.avatarUrl,
                    size: "sm"
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "flex-1",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 mb-1",
                      children: [
                        /* @__PURE__ */ jsx("span", {
                          className: "text-xs font-semibold text-text-primary",
                          children: (_a2 = c.author.fullName) != null ? _a2 : c.author.email
                        }),
                        /* @__PURE__ */ jsx("span", {
                          className: "text-xs text-text-tertiary",
                          children: new Date(c.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          })
                        }),
                        /* @__PURE__ */ jsx("button", {
                          type: "button",
                          onClick: () => handleDeleteComment(c.id),
                          title: "Delete comment",
                          className: "ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-text-tertiary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40",
                          children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
                        })
                      ]
                    }), /* @__PURE__ */ jsx("div", {
                      className: "bg-surface-tertiary rounded-xl px-3 py-2 text-sm text-text-secondary",
                      children: c.content
                    })]
                  })]
                }, c.id);
              })]
            }),
            /* @__PURE__ */ jsxs("form", {
              onSubmit: handleAddComment,
              className: "flex gap-2",
              children: [/* @__PURE__ */ jsx("input", {
                value: comment,
                onChange: (e) => setComment(e.target.value),
                placeholder: "Write a comment\u2026",
                className: "flex-1 px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface text-text-primary placeholder:text-text-tertiary"
              }), /* @__PURE__ */ jsx("button", {
                type: "submit",
                disabled: !comment.trim() || submittingComment,
                className: "h-9 w-9 flex items-center justify-center rounded-xl bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 transition-colors shrink-0",
                children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
              })]
            })
          ]
        })
      ]
    }), /* @__PURE__ */ jsxs("div", {
      className: "w-full lg:w-64 xl:w-72 shrink-0 px-5 py-4",
      children: [
        /* @__PURE__ */ jsx("p", {
          className: "text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-3",
          children: "Properties"
        }),
        /* @__PURE__ */ jsx(PropRow, {
          label: "Status",
          children: /* @__PURE__ */ jsx(PropDropdown, {
            trigger: /* @__PURE__ */ jsxs("div", {
              className: `inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${currentStatus.bg} ${currentStatus.text}`,
              children: [/* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full shrink-0 ${currentStatus.dot}` }), currentStatus.label]
            }),
            children: (close) => STATUS_OPTIONS$1.map((s) => /* @__PURE__ */ jsxs(DropdownItem$1, {
              selected: task.status === s.value,
              onClick: () => {
                onStatusChange(task.id, s.value);
                close();
              },
              children: [/* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full shrink-0 ${s.dot}` }), /* @__PURE__ */ jsx("span", {
                className: s.text,
                children: s.label
              })]
            }, s.value))
          })
        }),
        /* @__PURE__ */ jsx(PropRow, {
          label: "Priority",
          children: /* @__PURE__ */ jsx(PropDropdown, {
            trigger: /* @__PURE__ */ jsxs("div", {
              className: `inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-xs font-medium cursor-pointer hover:bg-surface-tertiary transition-colors ${currentPriority.text}`,
              children: [/* @__PURE__ */ jsx(Zap, { className: "h-3 w-3 shrink-0" }), currentPriority.label]
            }),
            children: (close) => PRIORITY_OPTIONS$1.map((p) => /* @__PURE__ */ jsxs(DropdownItem$1, {
              selected: task.priority === p.value,
              onClick: () => {
                onFieldUpdate(task.id, { priority: p.value });
                close();
              },
              children: [/* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full shrink-0 ${p.dot}` }), /* @__PURE__ */ jsx("span", {
                className: p.text,
                children: p.label
              })]
            }, p.value))
          })
        }),
        /* @__PURE__ */ jsx(PropRow, {
          label: "Assignee",
          children: /* @__PURE__ */ jsx(PropDropdown, {
            trigger: /* @__PURE__ */ jsx("div", {
              className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-xs cursor-pointer hover:bg-surface-tertiary transition-colors text-text-secondary",
              children: task.assignee ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Avatar, {
                name: task.assignee.fullName,
                src: task.assignee.avatarUrl,
                size: "sm"
              }), /* @__PURE__ */ jsx("span", {
                className: "text-text-primary truncate max-w-[110px]",
                children: (_f = task.assignee.fullName) != null ? _f : task.assignee.email
              })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
                className: "h-5 w-5 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center shrink-0",
                children: /* @__PURE__ */ jsx(UserRound, { className: "h-3 w-3 text-text-tertiary" })
              }), /* @__PURE__ */ jsx("span", {
                className: "text-text-tertiary",
                children: "Unassigned"
              })] })
            }),
            children: (close) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(DropdownItem$1, {
              selected: !task.assigneeId,
              onClick: () => {
                onFieldUpdate(task.id, { assigneeId: null });
                close();
              },
              children: [/* @__PURE__ */ jsx("div", {
                className: "h-5 w-5 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center shrink-0",
                children: /* @__PURE__ */ jsx(UserRound, { className: "h-3 w-3 text-text-tertiary" })
              }), /* @__PURE__ */ jsx("span", {
                className: "text-text-secondary",
                children: "Unassigned"
              })]
            }), members.map((m) => {
              var _a2;
              return /* @__PURE__ */ jsxs(DropdownItem$1, {
                selected: task.assigneeId === m.userId,
                onClick: () => {
                  onFieldUpdate(task.id, { assigneeId: m.userId });
                  close();
                },
                children: [/* @__PURE__ */ jsx(Avatar, {
                  name: m.user.fullName,
                  src: m.user.avatarUrl,
                  size: "sm"
                }), /* @__PURE__ */ jsx("span", { children: (_a2 = m.user.fullName) != null ? _a2 : m.user.email })]
              }, m.userId);
            })] })
          })
        }),
        /* @__PURE__ */ jsx(PropRow, {
          label: "Due date",
          children: /* @__PURE__ */ jsx(PropDropdown, {
            trigger: /* @__PURE__ */ jsxs("div", {
              className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-xs cursor-pointer hover:bg-surface-tertiary transition-colors text-text-secondary",
              children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ jsx("span", {
                className: currentDueDateValue ? "text-text-primary" : "text-text-tertiary",
                children: currentDueDateValue ? (/* @__PURE__ */ new Date(currentDueDateValue + "T00:00:00")).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                }) : "Set due date"
              })]
            }),
            children: (close) => /* @__PURE__ */ jsxs("div", {
              className: "p-3 space-y-2",
              children: [
                /* @__PURE__ */ jsx("p", {
                  className: "text-[10px] font-semibold uppercase tracking-wider text-text-tertiary px-1",
                  children: "Due date"
                }),
                /* @__PURE__ */ jsx("input", {
                  type: "date",
                  value: currentDueDateValue,
                  onChange: (e) => {
                    onFieldUpdate(task.id, { dueDate: e.target.value || null });
                    close();
                  },
                  className: "w-full px-3 py-1.5 border border-border rounded-lg text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                }),
                currentDueDateValue && /* @__PURE__ */ jsxs("button", {
                  type: "button",
                  onClick: () => {
                    onFieldUpdate(task.id, { dueDate: null });
                    close();
                  },
                  className: "w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors",
                  children: [/* @__PURE__ */ jsx(X, { className: "h-3 w-3" }), " Clear date"]
                })
              ]
            })
          })
        }),
        /* @__PURE__ */ jsx(PropRow, {
          label: "Created by",
          children: /* @__PURE__ */ jsxs("div", {
            className: "inline-flex items-center gap-1.5 text-xs text-text-secondary px-2",
            children: [/* @__PURE__ */ jsx(Avatar, {
              name: task.creator.fullName,
              src: task.creator.avatarUrl,
              size: "sm"
            }), /* @__PURE__ */ jsx("span", { children: (_g = task.creator.fullName) != null ? _g : task.creator.email })]
          })
        }),
        /* @__PURE__ */ jsx(PropRow, {
          label: "Created",
          children: /* @__PURE__ */ jsx("span", {
            className: "inline-block text-xs text-text-secondary px-2",
            children: new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })
          })
        })
      ]
    })]
  });
}
var sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-5xl"
};
function Modal({ open, onClose, title, children, size = "md", contentClassName = "" }) {
  const overlayRef = useRef(null);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return /* @__PURE__ */ jsx("div", {
    ref: overlayRef,
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-overlay-in",
    onClick: (e) => {
      if (e.target === overlayRef.current) onClose();
    },
    children: /* @__PURE__ */ jsxs("div", {
      className: `bg-surface rounded-xl shadow-2xl w-full ${sizeClasses[size]} ${contentClassName} animate-modal-in flex flex-col max-h-[90vh]`,
      children: [/* @__PURE__ */ jsxs("div", {
        className: `flex items-center justify-between px-6 shrink-0 ${title ? "py-4 border-b border-border" : "pt-3 pb-0"}`,
        children: [title ? /* @__PURE__ */ jsx("h2", {
          className: "text-base font-semibold text-text-primary",
          children: title
        }) : /* @__PURE__ */ jsx("div", {}), /* @__PURE__ */ jsx("button", {
          onClick: onClose,
          className: "p-1.5 rounded-lg hover:bg-surface-tertiary text-text-tertiary hover:text-text-primary transition-colors duration-150",
          children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex-1 min-h-0 overflow-y-auto",
        children
      })]
    })
  });
}
var COLUMNS = [
  {
    status: "BACKLOG",
    label: "Backlog",
    color: "bg-slate-400",
    dragOver: "bg-slate-100/60   dark:bg-slate-800/40"
  },
  {
    status: "TODO",
    label: "To Do",
    color: "bg-violet-400",
    dragOver: "bg-violet-100/60  dark:bg-violet-950/40"
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    color: "bg-fuchsia-400",
    dragOver: "bg-fuchsia-100/60 dark:bg-fuchsia-950/40"
  },
  {
    status: "IN_REVIEW",
    label: "In Review",
    color: "bg-cyan-400",
    dragOver: "bg-cyan-100/60    dark:bg-cyan-950/40"
  },
  {
    status: "DONE",
    label: "Done",
    color: "bg-emerald-400",
    dragOver: "bg-emerald-100/60 dark:bg-emerald-950/40"
  },
  {
    status: "CANCELLED",
    label: "Cancelled",
    color: "bg-rose-400",
    dragOver: "bg-rose-100/60    dark:bg-rose-950/40"
  }
];
function clampIndex(index, max) {
  return Math.max(0, Math.min(index, max));
}
function reorderTasks(tasks, taskId, targetStatus, targetIndex) {
  const movingTask = tasks.find((task) => task.id === taskId);
  if (!movingTask) return tasks;
  const buckets = Object.fromEntries(COLUMNS.map((column) => [column.status, tasks.filter((task) => task.status === column.status && task.id !== taskId)]));
  const nextIndex = clampIndex(targetIndex, buckets[targetStatus].length);
  const movedTask = movingTask.status === targetStatus ? movingTask : {
    ...movingTask,
    status: targetStatus
  };
  buckets[targetStatus] = [
    ...buckets[targetStatus].slice(0, nextIndex),
    movedTask,
    ...buckets[targetStatus].slice(nextIndex)
  ].map((task, index) => ({
    ...task,
    position: index
  }));
  if (movingTask.status !== targetStatus) buckets[movingTask.status] = buckets[movingTask.status].map((task, index) => ({
    ...task,
    position: index
  }));
  return COLUMNS.flatMap((column) => buckets[column.status]);
}
function TaskBoard({ projectId, tasks, onRefresh, onTasksChange, dragDisabled = false }) {
  const [boardTasks, setBoardTasks] = useState(tasks);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStatus, setCreateStatus] = useState("TODO");
  const [selectedTask, setSelectedTask] = useState(null);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [movingTaskId, setMovingTaskId] = useState(null);
  useEffect(() => {
    setBoardTasks(tasks);
  }, [tasks]);
  const handleCreate = async (data) => {
    var _a, _b;
    await createTask({ data: {
      projectId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: (_a = data.dueDate) != null ? _a : void 0,
      assigneeId: (_b = data.assigneeId) != null ? _b : void 0
    } });
    setShowCreateModal(false);
    await onRefresh();
  };
  const handleUpdate = async (data) => {
    if (!selectedTask) return;
    const updated = await updateTask({ data: {
      taskId: selectedTask.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      assigneeId: data.assigneeId
    } });
    setSelectedTask((cur) => (cur == null ? void 0 : cur.id) === updated.id ? {
      ...cur,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      priority: updated.priority,
      dueDate: updated.dueDate,
      assignee: updated.assignee,
      assigneeId: updated.assigneeId
    } : cur);
    await onRefresh();
  };
  const handleFieldUpdate = async (taskId, data) => {
    const updated = await updateTask({ data: {
      taskId,
      priority: data.priority,
      dueDate: data.dueDate,
      assigneeId: data.assigneeId
    } });
    setSelectedTask((cur) => (cur == null ? void 0 : cur.id) === taskId ? {
      ...cur,
      priority: updated.priority,
      dueDate: updated.dueDate,
      assignee: updated.assignee,
      assigneeId: updated.assigneeId
    } : cur);
    await onRefresh();
  };
  const handleDelete = async (taskId) => {
    await deleteTask({ data: { taskId } });
    setSelectedTask(null);
    await onRefresh();
  };
  const handleStatusChange = async (taskId, newStatus) => {
    const updatedTask = await updateTask({ data: {
      taskId,
      status: newStatus
    } });
    setSelectedTask((currentTask) => currentTask && currentTask.id === updatedTask.id ? {
      ...currentTask,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
      assignee: updatedTask.assignee,
      assigneeId: updatedTask.assigneeId,
      updatedAt: updatedTask.updatedAt
    } : currentTask);
    await onRefresh();
  };
  const handleSelectTask = async (taskId) => {
    setLoadingTaskId(taskId);
    try {
      setSelectedTask(await getTask({ data: { taskId } }));
    } finally {
      setLoadingTaskId(null);
    }
  };
  const moveTaskPreview = (taskId, targetStatus, targetIndex) => {
    setBoardTasks((currentTasks) => reorderTasks(currentTasks, taskId, targetStatus, targetIndex));
  };
  const handleDragStart = (event, taskId) => {
    if (dragDisabled) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", taskId);
    setDraggedTaskId(taskId);
  };
  const handleCardDragOver = (event, targetTaskId, targetStatus) => {
    if (dragDisabled) return;
    const taskId = draggedTaskId != null ? draggedTaskId : event.dataTransfer.getData("text/plain");
    if (!taskId) return;
    event.preventDefault();
    event.stopPropagation();
    const currentTargetIndex = boardTasks.filter((task) => task.status === targetStatus).findIndex((task) => task.id === targetTaskId);
    if (currentTargetIndex === -1) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    moveTaskPreview(taskId, targetStatus, currentTargetIndex + (event.clientY - bounds.top > bounds.height / 2 ? 1 : 0));
  };
  const handleColumnDragOver = (event, targetStatus) => {
    if (dragDisabled) return;
    const taskId = draggedTaskId != null ? draggedTaskId : event.dataTransfer.getData("text/plain");
    if (!taskId) return;
    event.preventDefault();
    const nextIndex = boardTasks.filter((task) => task.status === targetStatus).length;
    moveTaskPreview(taskId, targetStatus, nextIndex);
  };
  const handleDrop = async (event) => {
    if (dragDisabled) return;
    event.preventDefault();
    const taskId = draggedTaskId != null ? draggedTaskId : event.dataTransfer.getData("text/plain");
    if (!taskId) return;
    const nextTask = boardTasks.find((task) => task.id === taskId);
    const previousTask = tasks.find((task) => task.id === taskId);
    if (!nextTask || !previousTask) {
      setDraggedTaskId(null);
      return;
    }
    const nextIndex = boardTasks.filter((task) => task.status === nextTask.status).findIndex((task) => task.id === taskId);
    const previousIndex = tasks.filter((task) => task.status === previousTask.status).findIndex((task) => task.id === taskId);
    const previousTasks = tasks;
    const nextBoardTasks = boardTasks;
    setDraggedTaskId(null);
    if (nextTask.status === previousTask.status && nextIndex === previousIndex) {
      setBoardTasks(tasks);
      return;
    }
    setMovingTaskId(taskId);
    onTasksChange(nextBoardTasks);
    try {
      await moveTask({ data: {
        taskId,
        targetStatus: nextTask.status,
        targetIndex: nextIndex
      } });
      setSelectedTask((currentTask) => currentTask && currentTask.id === taskId ? {
        ...currentTask,
        status: nextTask.status,
        position: nextIndex
      } : currentTask);
      setMovingTaskId(null);
      onRefresh().catch(() => {
        setBoardTasks(previousTasks);
        onTasksChange(previousTasks);
      });
    } catch {
      setBoardTasks(previousTasks);
      onTasksChange(previousTasks);
      setMovingTaskId(null);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", {
      className: "flex gap-4 overflow-x-auto pb-4",
      children: COLUMNS.map((column) => {
        const columnTasks = boardTasks.filter((task) => task.status === column.status);
        return /* @__PURE__ */ jsxs("div", {
          className: "flex-shrink-0 w-72 flex flex-col bg-surface-tertiary rounded-xl transition-shadow duration-200",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between px-3 py-2.5",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx("div", { className: `h-2.5 w-2.5 rounded-full ${column.color}` }),
                /* @__PURE__ */ jsx("span", {
                  className: "text-sm font-semibold text-text-primary",
                  children: column.label
                }),
                /* @__PURE__ */ jsx("span", {
                  className: "text-xs text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded-full",
                  children: columnTasks.length
                })
              ]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-1",
              children: [!dragDisabled && /* @__PURE__ */ jsxs("span", {
                className: "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-text-tertiary",
                children: [/* @__PURE__ */ jsx(GripVertical, { className: "h-3.5 w-3.5" }), "Drag"]
              }), /* @__PURE__ */ jsx("button", {
                onClick: () => {
                  setCreateStatus(column.status);
                  setShowCreateModal(true);
                },
                className: "p-1 rounded hover:bg-surface text-text-tertiary hover:text-text-primary transition-colors",
                children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: `kanban-column flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[100px] rounded-b-xl transition-colors duration-150 ${draggedTaskId ? column.dragOver : ""}`,
            onDragOver: (event) => handleColumnDragOver(event, column.status),
            onDrop: handleDrop,
            children: [columnTasks.map((task) => /* @__PURE__ */ jsx(TaskCard, {
              task,
              draggable: !dragDisabled,
              onDragStart: (event) => handleDragStart(event, task.id),
              onDragEnd: () => {
                setDraggedTaskId(null);
              },
              onDragOver: (event) => handleCardDragOver(event, task.id, column.status),
              onDrop: handleDrop,
              isDragging: task.id === draggedTaskId || task.id === movingTaskId,
              onClick: () => {
                if (draggedTaskId || movingTaskId) return;
                handleSelectTask(task.id);
              }
            }, task.id)), columnTasks.length === 0 && /* @__PURE__ */ jsx("div", {
              className: "rounded-lg border border-dashed border-border-strong px-3 py-6 text-center text-sm text-text-tertiary",
              children: dragDisabled ? "No tasks in this column" : "Drop a task here"
            })]
          })]
        }, column.status);
      })
    }),
    dragDisabled && /* @__PURE__ */ jsx("p", {
      className: "text-sm text-text-secondary",
      children: "Clear the active filters to drag tasks between columns and reorder them."
    }),
    /* @__PURE__ */ jsx(Modal, {
      open: showCreateModal,
      onClose: () => setShowCreateModal(false),
      title: "New Task",
      size: "lg",
      contentClassName: "h-[36rem]",
      children: /* @__PURE__ */ jsx(TaskForm, {
        projectId,
        initialData: { status: createStatus },
        onSubmit: handleCreate,
        onCancel: () => setShowCreateModal(false)
      })
    }),
    /* @__PURE__ */ jsxs(Modal, {
      open: !!selectedTask || !!loadingTaskId,
      onClose: () => {
        setSelectedTask(null);
        setLoadingTaskId(null);
      },
      size: "xl",
      children: [loadingTaskId && !selectedTask ? /* @__PURE__ */ jsx("div", {
        className: "py-12 text-center text-sm text-text-secondary",
        children: "Loading\u2026"
      }) : null, selectedTask && /* @__PURE__ */ jsx(TaskDetail, {
        task: selectedTask,
        projectId,
        onUpdate: handleUpdate,
        onFieldUpdate: handleFieldUpdate,
        onDelete: handleDelete,
        onStatusChange: handleStatusChange,
        onClose: () => setSelectedTask(null)
      })]
    })
  ] });
}
var GROUPS = [
  {
    status: "BACKLOG",
    label: "Backlog",
    dot: "bg-slate-400",
    header: "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400",
    rowAccent: "border-l-slate-300 dark:border-l-slate-600"
  },
  {
    status: "TODO",
    label: "To Do",
    dot: "bg-violet-400",
    header: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400",
    rowAccent: "border-l-violet-300 dark:border-l-violet-700"
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    dot: "bg-fuchsia-400",
    header: "bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-400",
    rowAccent: "border-l-fuchsia-300 dark:border-l-fuchsia-600"
  },
  {
    status: "IN_REVIEW",
    label: "In Review",
    dot: "bg-cyan-400",
    header: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400",
    rowAccent: "border-l-cyan-300 dark:border-l-cyan-700"
  },
  {
    status: "DONE",
    label: "Done",
    dot: "bg-emerald-400",
    header: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
    rowAccent: "border-l-emerald-300 dark:border-l-emerald-600"
  },
  {
    status: "CANCELLED",
    label: "Cancelled",
    dot: "bg-rose-400",
    header: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    rowAccent: "border-l-rose-300 dark:border-l-rose-700"
  }
];
var priorityConfig = {
  URGENT: {
    variant: "danger",
    label: "Urgent"
  },
  HIGH: {
    variant: "warning",
    label: "High"
  },
  MEDIUM: {
    variant: "info",
    label: "Medium"
  },
  LOW: {
    variant: "default",
    label: "Low"
  },
  NONE: {
    variant: "default",
    label: ""
  }
};
function TaskList({ projectId, tasks, onRefresh, onTasksChange }) {
  const [collapsed, setCollapsed] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStatus, setCreateStatus] = useState("TODO");
  const [selectedTask, setSelectedTask] = useState(null);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const toggleGroup = (status) => setCollapsed((prev) => ({
    ...prev,
    [status]: !prev[status]
  }));
  const handleCreate = async (data) => {
    var _a, _b;
    await createTask({ data: {
      projectId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: (_a = data.dueDate) != null ? _a : void 0,
      assigneeId: (_b = data.assigneeId) != null ? _b : void 0
    } });
    setShowCreateModal(false);
    await onRefresh();
  };
  const handleUpdate = async (data) => {
    if (!selectedTask) return;
    const updated = await updateTask({ data: {
      taskId: selectedTask.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      assigneeId: data.assigneeId
    } });
    setSelectedTask((cur) => (cur == null ? void 0 : cur.id) === updated.id ? {
      ...cur,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      priority: updated.priority,
      dueDate: updated.dueDate,
      assignee: updated.assignee,
      assigneeId: updated.assigneeId
    } : cur);
    await onRefresh();
  };
  const handleFieldUpdate = async (taskId, data) => {
    const updated = await updateTask({ data: {
      taskId,
      priority: data.priority,
      dueDate: data.dueDate,
      assigneeId: data.assigneeId
    } });
    setSelectedTask((cur) => (cur == null ? void 0 : cur.id) === taskId ? {
      ...cur,
      priority: updated.priority,
      dueDate: updated.dueDate,
      assignee: updated.assignee,
      assigneeId: updated.assigneeId
    } : cur);
    await onRefresh();
  };
  const handleDelete = async (taskId) => {
    await deleteTask({ data: { taskId } });
    setSelectedTask(null);
    await onRefresh();
  };
  const handleStatusChange = async (taskId, newStatus) => {
    const updated = await updateTask({ data: {
      taskId,
      status: newStatus
    } });
    setSelectedTask((cur) => cur && cur.id === updated.id ? {
      ...cur,
      status: updated.status
    } : cur);
    await onRefresh();
  };
  const handleSelectTask = async (taskId) => {
    setLoadingTaskId(taskId);
    try {
      setSelectedTask(await getTask({ data: { taskId } }));
    } finally {
      setLoadingTaskId(null);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", {
      className: "rounded-xl border border-border overflow-hidden bg-surface shadow-sm",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-[1fr_140px_120px_110px_120px] gap-0 border-b border-border bg-surface-tertiary px-4 py-2.5 text-xs font-semibold text-text-tertiary uppercase tracking-wide",
        children: [
          /* @__PURE__ */ jsx("span", { children: "Name" }),
          /* @__PURE__ */ jsx("span", { children: "Assignee" }),
          /* @__PURE__ */ jsx("span", { children: "Due date" }),
          /* @__PURE__ */ jsx("span", { children: "Priority" }),
          /* @__PURE__ */ jsx("span", { children: "Status" })
        ]
      }), GROUPS.map((group) => {
        const groupTasks = tasks.filter((t) => t.status === group.status);
        const isCollapsed = collapsed[group.status];
        return /* @__PURE__ */ jsxs("div", {
          className: "border-b border-border last:border-b-0",
          children: [/* @__PURE__ */ jsxs("div", {
            className: `flex items-center justify-between px-4 py-2 cursor-pointer select-none ${group.header} transition-opacity`,
            onClick: () => toggleGroup(group.status),
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                isCollapsed ? /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5 opacity-60" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5 opacity-60" }),
                /* @__PURE__ */ jsx("div", { className: `h-2.5 w-2.5 rounded-full ${group.dot}` }),
                /* @__PURE__ */ jsx("span", {
                  className: "text-sm font-semibold",
                  children: group.label
                }),
                /* @__PURE__ */ jsx("span", {
                  className: "text-xs opacity-60 font-normal",
                  children: groupTasks.length
                })
              ]
            }), /* @__PURE__ */ jsxs("button", {
              onClick: (e) => {
                e.stopPropagation();
                setCreateStatus(group.status);
                setShowCreateModal(true);
              },
              className: "flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity px-2 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10",
              children: [/* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }), "Add task"]
            })]
          }), !isCollapsed && /* @__PURE__ */ jsx("div", { children: groupTasks.length === 0 ? /* @__PURE__ */ jsx("div", {
            className: "px-4 py-3 text-xs text-text-tertiary italic border-l-4 border-transparent ml-0",
            children: "No tasks in this group"
          }) : groupTasks.map((task) => {
            var _a, _b;
            const isOverdue = task.dueDate && new Date(task.dueDate) < /* @__PURE__ */ new Date() && task.status !== "DONE" && task.status !== "CANCELLED";
            const isLoading = loadingTaskId === task.id;
            return /* @__PURE__ */ jsxs("div", {
              onClick: () => handleSelectTask(task.id),
              className: `grid grid-cols-[1fr_140px_120px_110px_120px] gap-0 items-center px-4 py-2.5 border-l-4 ${group.rowAccent} border-b border-border last:border-b-0 cursor-pointer hover:bg-surface-tertiary/60 dark:hover:bg-white/[0.03] transition-colors duration-100 ${isLoading ? "opacity-50" : ""} ${task.status === "CANCELLED" ? "opacity-60" : ""}`,
              children: [
                /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-2 min-w-0 pr-4",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: `text-sm text-text-primary truncate ${task.status === "CANCELLED" ? "line-through text-text-tertiary" : ""}`,
                    children: task.title
                  }), task._count && task._count.comments > 0 && /* @__PURE__ */ jsxs("span", {
                    className: "shrink-0 inline-flex items-center gap-0.5 text-xs text-text-tertiary",
                    children: [/* @__PURE__ */ jsx(MessageSquare, { className: "h-3 w-3" }), task._count.comments]
                  })]
                }),
                /* @__PURE__ */ jsx("div", { children: task.assignee ? /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-1.5",
                  children: [/* @__PURE__ */ jsx(Avatar, {
                    name: task.assignee.fullName,
                    src: task.assignee.avatarUrl,
                    size: "sm"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "text-xs text-text-secondary truncate max-w-[80px]",
                    children: (_b = (_a = task.assignee.fullName) == null ? void 0 : _a.split(" ")[0]) != null ? _b : task.assignee.email
                  })]
                }) : /* @__PURE__ */ jsx("span", {
                  className: "text-xs text-text-tertiary",
                  children: "\u2014"
                }) }),
                /* @__PURE__ */ jsx("div", { children: task.dueDate ? /* @__PURE__ */ jsxs("span", {
                  className: `inline-flex items-center gap-1 text-xs ${isOverdue ? "text-rose-500 font-medium" : "text-text-secondary"}`,
                  children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3 shrink-0" }), new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })]
                }) : /* @__PURE__ */ jsx("span", {
                  className: "text-xs text-text-tertiary",
                  children: "\u2014"
                }) }),
                /* @__PURE__ */ jsx("div", { children: task.priority !== "NONE" ? /* @__PURE__ */ jsx(Badge, {
                  variant: priorityConfig[task.priority].variant,
                  children: priorityConfig[task.priority].label
                }) : /* @__PURE__ */ jsx("span", {
                  className: "text-xs text-text-tertiary",
                  children: "\u2014"
                }) }),
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("span", {
                  className: "inline-flex items-center gap-1.5 text-xs text-text-secondary",
                  children: [/* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full shrink-0 ${group.dot}` }), group.label]
                }) })
              ]
            }, task.id);
          }) })]
        }, group.status);
      })]
    }),
    /* @__PURE__ */ jsx(Modal, {
      open: showCreateModal,
      onClose: () => setShowCreateModal(false),
      title: "New Task",
      size: "lg",
      contentClassName: "h-[36rem]",
      children: /* @__PURE__ */ jsx(TaskForm, {
        projectId,
        initialData: { status: createStatus },
        onSubmit: handleCreate,
        onCancel: () => setShowCreateModal(false)
      })
    }),
    /* @__PURE__ */ jsxs(Modal, {
      open: !!selectedTask || !!loadingTaskId,
      onClose: () => {
        setSelectedTask(null);
        setLoadingTaskId(null);
      },
      size: "xl",
      children: [loadingTaskId && !selectedTask ? /* @__PURE__ */ jsx("div", {
        className: "py-12 text-center text-sm text-text-secondary",
        children: "Loading\u2026"
      }) : null, selectedTask && /* @__PURE__ */ jsx(TaskDetail, {
        task: selectedTask,
        projectId,
        onUpdate: handleUpdate,
        onFieldUpdate: handleFieldUpdate,
        onDelete: handleDelete,
        onStatusChange: handleStatusChange,
        onClose: () => setSelectedTask(null)
      })]
    })
  ] });
}
var STATUS_OPTIONS = [
  {
    value: "BACKLOG",
    label: "Backlog",
    dot: "bg-slate-400"
  },
  {
    value: "TODO",
    label: "To Do",
    dot: "bg-violet-400"
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    dot: "bg-fuchsia-400"
  },
  {
    value: "IN_REVIEW",
    label: "In Review",
    dot: "bg-cyan-400"
  },
  {
    value: "DONE",
    label: "Done",
    dot: "bg-emerald-400"
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    dot: "bg-rose-400"
  }
];
var PRIORITY_OPTIONS = [
  {
    value: "URGENT",
    label: "Urgent",
    bar: "bg-rose-500"
  },
  {
    value: "HIGH",
    label: "High",
    bar: "bg-amber-500"
  },
  {
    value: "MEDIUM",
    label: "Medium",
    bar: "bg-cyan-500"
  },
  {
    value: "LOW",
    label: "Low",
    bar: "bg-slate-400"
  },
  {
    value: "NONE",
    label: "No Priority",
    bar: "bg-text-tertiary"
  }
];
function FilterPill({ label, icon, active, onClear, children }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({
    top: 0,
    left: 0
  });
  const triggerRef = useRef(null);
  const dropRef = useRef(null);
  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const estimatedH = 300;
      setPos({
        top: window.innerHeight - rect.bottom < estimatedH && rect.top > estimatedH ? rect.top - estimatedH - 4 : rect.bottom + 6,
        left: rect.left
      });
    }
    setOpen((o) => !o);
  };
  useEffect(() => {
    function onOutside(e) {
      var _a, _b;
      const t = e.target;
      if (!((_a = dropRef.current) == null ? void 0 : _a.contains(t)) && !((_b = triggerRef.current) == null ? void 0 : _b.contains(t))) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);
  return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("button", {
    ref: triggerRef,
    onClick: handleToggle,
    className: `inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium transition-all duration-150 whitespace-nowrap ${active ? "bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300" : "bg-surface border-border text-text-secondary hover:border-border-strong hover:text-text-primary dark:hover:border-border-strong"}`,
    children: [
      /* @__PURE__ */ jsx("span", {
        className: "opacity-70",
        children: icon
      }),
      label,
      active ? /* @__PURE__ */ jsx(X, {
        className: "h-3 w-3 opacity-60 hover:opacity-100 shrink-0",
        onClick: (e) => {
          e.stopPropagation();
          onClear();
          setOpen(false);
        }
      }) : /* @__PURE__ */ jsx(ChevronDown, { className: `h-3 w-3 opacity-50 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}` })
    ]
  }), open && /* @__PURE__ */ jsx("div", {
    ref: dropRef,
    style: {
      position: "fixed",
      top: pos.top,
      left: pos.left,
      zIndex: 9999
    },
    className: "min-w-[200px] bg-surface border border-border rounded-xl shadow-xl py-1 animate-card-in",
    children
  })] });
}
function DropdownItem({ selected, onClick, children }) {
  return /* @__PURE__ */ jsxs("button", {
    onClick,
    className: `w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-left transition-colors duration-100 ${selected ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" : "text-text-primary hover:bg-surface-tertiary"}`,
    children: [children, selected && /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 shrink-0 text-primary-600 dark:text-primary-400" })]
  });
}
function DropdownDivider() {
  return /* @__PURE__ */ jsx("div", { className: "my-1 border-t border-border" });
}
function DropdownLabel({ children }) {
  return /* @__PURE__ */ jsx("p", {
    className: "px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary",
    children
  });
}
function TaskFilters({ search, onSearchChange, statusFilter, onStatusChange, priorityFilter, onPriorityChange, assigneeFilter, onAssigneeChange, currentUserId, members }) {
  var _a, _b, _c;
  const hasAnyFilter = !!(search || statusFilter || priorityFilter || assigneeFilter);
  const currentMember = members.find((m) => m.user.id === currentUserId);
  const otherMembers = members.filter((m) => m.user.id !== currentUserId);
  const assigneeLabel = (() => {
    var _a2, _b2, _c2;
    if (!assigneeFilter) return "Assignee";
    if (assigneeFilter === "me") return "Me";
    if (assigneeFilter === "unassigned") return "Unassigned";
    return (_c2 = (_b2 = (_a2 = members.find((m) => m.user.id === assigneeFilter)) == null ? void 0 : _a2.user.fullName) == null ? void 0 : _b2.split(" ")[0]) != null ? _c2 : "User";
  })();
  const statusLabel = (() => {
    var _a2, _b2;
    if (!statusFilter) return "Status";
    return (_b2 = (_a2 = STATUS_OPTIONS.find((s) => s.value === statusFilter)) == null ? void 0 : _a2.label) != null ? _b2 : "Status";
  })();
  const priorityLabel = (() => {
    var _a2, _b2;
    if (!priorityFilter) return "Priority";
    return (_b2 = (_a2 = PRIORITY_OPTIONS.find((p) => p.value === priorityFilter)) == null ? void 0 : _a2.label) != null ? _b2 : "Priority";
  })();
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-wrap items-center gap-2",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "relative min-w-[220px] flex-1",
        children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" }),
          /* @__PURE__ */ jsx("input", {
            type: "text",
            value: search,
            onChange: (e) => onSearchChange(e.target.value),
            placeholder: "Search tasks...",
            className: "w-full h-8 pl-8 pr-3 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface text-text-primary placeholder:text-text-tertiary transition-colors"
          }),
          search && /* @__PURE__ */ jsx("button", {
            onClick: () => onSearchChange(""),
            className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary",
            children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
          })
        ]
      }),
      /* @__PURE__ */ jsx("div", { className: "h-5 w-px bg-border hidden sm:block" }),
      /* @__PURE__ */ jsxs("button", {
        onClick: () => onAssigneeChange(assigneeFilter === "me" ? "" : "me"),
        className: `inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-medium transition-all duration-150 ${assigneeFilter === "me" ? "bg-primary-600 border-primary-600 text-white shadow-sm" : "bg-surface border-border text-text-secondary hover:border-border-strong hover:text-text-primary"}`,
        children: [/* @__PURE__ */ jsx(UserRound, { className: "h-3.5 w-3.5" }), "Me"]
      }),
      /* @__PURE__ */ jsxs(FilterPill, {
        label: assigneeLabel,
        icon: /* @__PURE__ */ jsx(UserRound, { className: "h-3.5 w-3.5" }),
        active: !!assigneeFilter,
        onClear: () => onAssigneeChange(""),
        children: [
          /* @__PURE__ */ jsx(DropdownLabel, { children: "Assignee" }),
          currentMember && /* @__PURE__ */ jsx(DropdownItem, {
            selected: assigneeFilter === "me",
            onClick: () => {
              onAssigneeChange(assigneeFilter === "me" ? "" : "me");
            },
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Avatar, {
                name: currentMember.user.fullName,
                src: currentMember.user.avatarUrl,
                size: "sm"
              }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
                className: "font-medium",
                children: (_a = currentMember.user.fullName) != null ? _a : currentMember.user.email
              }), /* @__PURE__ */ jsx("span", {
                className: "ml-1.5 px-1 py-0.5 rounded text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 font-medium",
                children: "you"
              })] })]
            })
          }),
          otherMembers.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(DropdownDivider, {}), otherMembers.map((m) => {
            var _a2;
            return /* @__PURE__ */ jsx(DropdownItem, {
              selected: assigneeFilter === m.user.id,
              onClick: () => onAssigneeChange(assigneeFilter === m.user.id ? "" : m.user.id),
              children: /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2",
                children: [/* @__PURE__ */ jsx(Avatar, {
                  name: m.user.fullName,
                  src: m.user.avatarUrl,
                  size: "sm"
                }), /* @__PURE__ */ jsx("span", { children: (_a2 = m.user.fullName) != null ? _a2 : m.user.email })]
              })
            }, m.user.id);
          })] }),
          /* @__PURE__ */ jsx(DropdownDivider, {}),
          /* @__PURE__ */ jsx(DropdownItem, {
            selected: assigneeFilter === "unassigned",
            onClick: () => onAssigneeChange(assigneeFilter === "unassigned" ? "" : "unassigned"),
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("div", {
                className: "h-7 w-7 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center",
                children: /* @__PURE__ */ jsx(UserRound, { className: "h-3.5 w-3.5 text-text-tertiary" })
              }), /* @__PURE__ */ jsx("span", {
                className: "text-text-secondary",
                children: "No assignee"
              })]
            })
          })
        ]
      }),
      /* @__PURE__ */ jsxs(FilterPill, {
        label: statusLabel,
        icon: statusFilter ? /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full ${(_c = (_b = STATUS_OPTIONS.find((s) => s.value === statusFilter)) == null ? void 0 : _b.dot) != null ? _c : "bg-text-tertiary"}` }) : /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full border border-current opacity-50" }),
        active: !!statusFilter,
        onClear: () => onStatusChange(""),
        children: [/* @__PURE__ */ jsx(DropdownLabel, { children: "Status" }), STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsx(DropdownItem, {
          selected: statusFilter === s.value,
          onClick: () => onStatusChange(statusFilter === s.value ? "" : s.value),
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full shrink-0 ${s.dot}` }), s.label]
          })
        }, s.value))]
      }),
      /* @__PURE__ */ jsxs(FilterPill, {
        label: priorityLabel,
        icon: /* @__PURE__ */ jsx(Zap, { className: "h-3.5 w-3.5" }),
        active: !!priorityFilter,
        onClear: () => onPriorityChange(""),
        children: [/* @__PURE__ */ jsx(DropdownLabel, { children: "Priority" }), PRIORITY_OPTIONS.map((p) => /* @__PURE__ */ jsx(DropdownItem, {
          selected: priorityFilter === p.value,
          onClick: () => onPriorityChange(priorityFilter === p.value ? "" : p.value),
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex gap-0.5 items-end h-3.5",
              children: [
                /* @__PURE__ */ jsx("span", { className: `w-1 rounded-sm ${p.bar} ${p.value === "NONE" ? "h-1 opacity-30" : p.value === "LOW" ? "h-1.5" : p.value === "MEDIUM" ? "h-2.5" : p.value === "HIGH" ? "h-3" : "h-3.5"}` }),
                /* @__PURE__ */ jsx("span", { className: `w-1 rounded-sm ${p.bar} ${p.value === "NONE" ? "h-1 opacity-30" : p.value === "LOW" ? "h-2.5" : p.value === "MEDIUM" ? "h-2.5" : p.value === "HIGH" ? "h-3" : "h-3.5"}` }),
                /* @__PURE__ */ jsx("span", { className: `w-1 rounded-sm ${p.bar} ${p.value === "NONE" ? "h-1 opacity-30" : p.value === "LOW" ? "h-2.5" : p.value === "MEDIUM" ? "h-2.5" : p.value === "HIGH" ? "h-3.5" : "h-3.5"}` })
              ]
            }), p.label]
          })
        }, p.value))]
      }),
      hasAnyFilter && /* @__PURE__ */ jsxs("button", {
        onClick: () => {
          onSearchChange("");
          onStatusChange("");
          onPriorityChange("");
          onAssigneeChange("");
        },
        className: "inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors",
        children: [/* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" }), "Clear all"]
      })
    ]
  });
}
var projectRouteApi = getRouteApi("/_authed/projects/$projectId");
function ProjectBoardPage() {
  const project = projectRouteApi.useLoaderData();
  const { user } = useRouteContext({ from: "/_authed" });
  const initialTasks = Route$1.useLoaderData();
  const { projectId } = Route$1.useParams();
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState(() => {
    return "board";
  });
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);
  const setViewMode = (mode) => {
    setView(mode);
    localStorage.setItem("taskflow-view", mode);
  };
  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const filteredTasks = tasks.filter((task) => {
    var _a;
    const haystack = `${task.title} ${(_a = task.description) != null ? _a : ""}`.toLowerCase();
    const matchesSearch = normalizedSearch ? haystack.includes(normalizedSearch) : true;
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesAssignee = (() => {
      var _a2, _b;
      if (!assigneeFilter) return true;
      if (assigneeFilter === "me") return ((_a2 = task.assignee) == null ? void 0 : _a2.id) === user.id;
      if (assigneeFilter === "unassigned") return task.assignee === null;
      return ((_b = task.assignee) == null ? void 0 : _b.id) === assigneeFilter;
    })();
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });
  const hasActiveFilters = Boolean(normalizedSearch || statusFilter || priorityFilter || assigneeFilter);
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const openTasks = tasks.filter((t) => !["DONE", "CANCELLED"].includes(t.status)).length;
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || ["DONE", "CANCELLED"].includes(t.status)) return false;
    return new Date(t.dueDate) < /* @__PURE__ */ new Date();
  }).length;
  const completionRate = tasks.length === 0 ? 0 : Math.round(completedTasks / tasks.length * 100);
  const refreshTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await getTasksByProject({ data: { projectId } }));
    } catch {
      setError("Unable to refresh tasks right now.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ jsx(Card, {
        className: "border-primary-100 dark:border-primary-900/40 bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(236,72,153,0.08)_55%,rgba(255,255,255,0.7))] dark:from-primary-950/30 dark:via-surface dark:to-surface",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-3",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex flex-wrap items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(Badge, {
                  variant: "primary",
                  children: project.currentUserRole
                }),
                /* @__PURE__ */ jsxs(Badge, {
                  variant: "default",
                  children: [tasks.length, " total tasks"]
                }),
                filteredTasks.length !== tasks.length && /* @__PURE__ */ jsxs(Badge, {
                  variant: "info",
                  children: [filteredTasks.length, " in view"]
                })
              ]
            }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
              className: "text-xl font-semibold text-text-primary",
              children: "Task Board"
            }), /* @__PURE__ */ jsxs("p", {
              className: "mt-1 text-sm text-text-secondary",
              children: [
                "Plan work, track progress, and keep ",
                project.name,
                " moving."
              ]
            })] })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "min-w-36",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "mb-1 flex items-center justify-between text-xs text-text-secondary",
                children: [/* @__PURE__ */ jsx("span", { children: "Completion" }), /* @__PURE__ */ jsxs("span", { children: [completionRate, "%"] })]
              }), /* @__PURE__ */ jsx("div", {
                className: "h-2 rounded-full bg-surface-tertiary",
                children: /* @__PURE__ */ jsx("div", {
                  className: "h-2 rounded-full bg-primary-600 transition-all",
                  style: { width: `${completionRate}%` }
                })
              })]
            }), /* @__PURE__ */ jsxs(Button, {
              variant: "secondary",
              onClick: refreshTasks,
              disabled: loading,
              children: [/* @__PURE__ */ jsx(RefreshCcw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }), loading ? "Refreshing..." : "Refresh"]
            })]
          })]
        })
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 gap-4 md:grid-cols-3",
        children: [
          /* @__PURE__ */ jsxs(Card, {
            className: "space-y-2",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2 text-text-secondary",
                children: [/* @__PURE__ */ jsx(ListTodo, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
                  className: "text-sm font-medium",
                  children: "Open Work"
                })]
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-3xl font-bold text-text-primary",
                children: openTasks
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-sm text-text-secondary",
                children: "Tasks still in flight across the board."
              })
            ]
          }),
          /* @__PURE__ */ jsxs(Card, {
            className: "space-y-2",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2 text-text-secondary",
                children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
                  className: "text-sm font-medium",
                  children: "Completed"
                })]
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-3xl font-bold text-text-primary",
                children: completedTasks
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-sm text-text-secondary",
                children: "Finished tasks contributing to delivery."
              })
            ]
          }),
          /* @__PURE__ */ jsxs(Card, {
            className: "space-y-2",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "flex items-center gap-2 text-text-secondary",
                children: [/* @__PURE__ */ jsx(Clock3, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
                  className: "text-sm font-medium",
                  children: "Overdue"
                })]
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-3xl font-bold text-text-primary",
                children: overdueTasks
              }),
              /* @__PURE__ */ jsx("p", {
                className: "text-sm text-text-secondary",
                children: "Open tasks that have passed their due date."
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsxs(Card, {
        className: "space-y-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
          children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
            className: "text-sm font-semibold text-text-primary",
            children: "Filters"
          }), error && /* @__PURE__ */ jsx("p", {
            className: "text-xs text-rose-500 mt-0.5",
            children: error
          })] }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-0.5 bg-surface-tertiary rounded-lg p-1 self-start sm:self-auto",
            children: [/* @__PURE__ */ jsxs("button", {
              onClick: () => setViewMode("board"),
              title: "Board view",
              className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${view === "board" ? "bg-surface text-text-primary shadow-sm" : "text-text-tertiary hover:text-text-secondary"}`,
              children: [/* @__PURE__ */ jsx(Kanban, { className: "h-3.5 w-3.5" }), "Board"]
            }), /* @__PURE__ */ jsxs("button", {
              onClick: () => setViewMode("list"),
              title: "List view",
              className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${view === "list" ? "bg-surface text-text-primary shadow-sm" : "text-text-tertiary hover:text-text-secondary"}`,
              children: [/* @__PURE__ */ jsx(List, { className: "h-3.5 w-3.5" }), "List"]
            })]
          })]
        }), /* @__PURE__ */ jsx(TaskFilters, {
          search,
          onSearchChange: setSearch,
          statusFilter,
          onStatusChange: setStatusFilter,
          priorityFilter,
          onPriorityChange: setPriorityFilter,
          assigneeFilter,
          onAssigneeChange: setAssigneeFilter,
          currentUserId: user.id,
          members: project.members
        })]
      }),
      view === "board" ? /* @__PURE__ */ jsx(TaskBoard, {
        projectId,
        tasks: filteredTasks,
        onRefresh: refreshTasks,
        onTasksChange: setTasks,
        dragDisabled: hasActiveFilters
      }) : /* @__PURE__ */ jsx(TaskList, {
        projectId,
        tasks: filteredTasks,
        onRefresh: refreshTasks,
        onTasksChange: setTasks
      })
    ]
  });
}

export { ProjectBoardPage as component };
//# sourceMappingURL=projects._projectId.index-BfYni3jk.mjs.map
