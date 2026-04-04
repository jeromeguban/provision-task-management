import { R as Route } from './routeTree.gen-BxSkGuzs.mjs';
import { C as Card } from './Card-jDSerDDM.mjs';
import { B as Badge } from './Badge-Dd7uaF2k.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import { FolderKanban, Plus, ListTodo, BarChart3, CheckCircle2, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import '@tanstack/react-router/ssr/server';
import '@tanstack/history';
import '@tanstack/router-core/ssr/client';
import '@tanstack/router-core';
import 'tiny-invariant';
import 'tiny-warning';
import 'node:async_hooks';
import '@tanstack/router-core/ssr/server';
import './nitro.mjs';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import '@supabase/ssr';
import '@prisma/client';

function DashboardPage() {
  const stats = Route.useLoaderData();
  const completionRate = stats.totalTasks === 0 ? 0 : Math.round(stats.completedTasks / stats.totalTasks * 100);
  const activeTasks = stats.totalTasks - stats.completedTasks;
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-6xl mx-auto space-y-6",
    children: [
      /* @__PURE__ */ jsx(Card, {
        className: "border-primary-100 bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(236,72,153,0.08)_55%,rgba(255,255,255,0.7))]",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-3",
            children: [/* @__PURE__ */ jsx(Badge, {
              variant: "primary",
              children: "Workspace Overview"
            }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
              className: "text-3xl font-bold text-text-primary",
              children: "Dashboard"
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-1 text-text-secondary",
              children: "Track delivery, spot blockers, and jump back into active work."
            })] })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex flex-wrap gap-3",
            children: [/* @__PURE__ */ jsxs(Link, {
              to: "/projects",
              className: "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-tertiary",
              children: [/* @__PURE__ */ jsx(FolderKanban, { className: "h-4 w-4" }), "View Projects"]
            }), /* @__PURE__ */ jsxs(Link, {
              to: "/projects/new",
              className: "inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] px-4 py-2 text-sm font-medium text-white shadow-[0_18px_34px_rgba(168,85,247,0.24)] transition-all hover:shadow-[0_20px_38px_rgba(168,85,247,0.32)]",
              children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "New Project"]
            })]
          })]
        })
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]",
        children: [/* @__PURE__ */ jsxs(Card, {
          className: "space-y-4",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between gap-4",
              children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm font-medium text-text-secondary",
                children: "Completion Rate"
              }), /* @__PURE__ */ jsxs("p", {
                className: "mt-1 text-3xl font-bold text-text-primary",
                children: [completionRate, "%"]
              })] }), /* @__PURE__ */ jsxs("div", {
                className: "rounded-full bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.12))] px-3 py-1 text-sm font-medium text-primary-700",
                children: [
                  stats.completedTasks,
                  "/",
                  stats.totalTasks,
                  " done"
                ]
              })]
            }),
            /* @__PURE__ */ jsx("div", {
              className: "h-3 rounded-full bg-surface-tertiary",
              children: /* @__PURE__ */ jsx("div", {
                className: "h-3 rounded-full bg-primary-600 transition-all",
                style: { width: `${completionRate}%` }
              })
            }),
            /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-text-secondary",
              children: [
                activeTasks,
                " active tasks remain across ",
                stats.totalProjects,
                " projects."
              ]
            })
          ]
        }), /* @__PURE__ */ jsxs(Card, {
          className: "space-y-3",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 text-text-secondary",
              children: [/* @__PURE__ */ jsx(ListTodo, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
                className: "text-sm font-medium",
                children: "Focus Today"
              })]
            }),
            /* @__PURE__ */ jsx("p", {
              className: "text-sm text-text-secondary",
              children: "Prioritize overdue work first, then clear tasks due within the next week."
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between rounded-lg bg-surface-tertiary px-3 py-2",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-sm text-text-secondary",
                children: "Overdue"
              }), /* @__PURE__ */ jsx("span", {
                className: "text-sm font-semibold text-text-primary",
                children: stats.overdueTasks
              })]
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between rounded-lg bg-surface-tertiary px-3 py-2",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-sm text-text-secondary",
                children: "Due soon"
              }), /* @__PURE__ */ jsx("span", {
                className: "text-sm font-semibold text-text-primary",
                children: stats.dueSoonTasks.length
              })]
            })
          ]
        })]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5",
        children: [
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "p-2 bg-primary-100 rounded-lg",
              children: /* @__PURE__ */ jsx(FolderKanban, { className: "h-5 w-5 text-primary-600" })
            }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
              className: "text-2xl font-bold text-text-primary",
              children: stats.totalProjects
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-text-secondary",
              children: "Projects"
            })] })]
          }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "p-2 bg-fuchsia-100 rounded-lg",
              children: /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5 text-fuchsia-600" })
            }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
              className: "text-2xl font-bold text-text-primary",
              children: stats.totalTasks
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-text-secondary",
              children: "Total Tasks"
            })] })]
          }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "p-2 bg-emerald-100 rounded-lg",
              children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5 text-emerald-600" })
            }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
              className: "text-2xl font-bold text-text-primary",
              children: stats.completedTasks
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-text-secondary",
              children: "Completed"
            })] })]
          }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "p-2 bg-cyan-100 rounded-lg",
              children: /* @__PURE__ */ jsx(ListTodo, { className: "h-5 w-5 text-cyan-600" })
            }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
              className: "text-2xl font-bold text-text-primary",
              children: activeTasks
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-text-secondary",
              children: "Active Tasks"
            })] })]
          }) }),
          /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3",
            children: [/* @__PURE__ */ jsx("div", {
              className: "p-2 bg-rose-100 rounded-lg",
              children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-rose-600" })
            }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
              className: "text-2xl font-bold text-text-primary",
              children: stats.overdueTasks
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-text-secondary",
              children: "Overdue"
            })] })]
          }) })
        ]
      }),
      /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
        children: [/* @__PURE__ */ jsxs(Card, {
          padding: false,
          children: [/* @__PURE__ */ jsx("div", {
            className: "px-6 py-4 border-b border-border",
            children: /* @__PURE__ */ jsxs("h2", {
              className: "text-lg font-semibold text-text-primary flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-text-tertiary" }), "Recent Tasks"]
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "divide-y divide-border",
            children: stats.recentTasks.length === 0 ? /* @__PURE__ */ jsx("p", {
              className: "px-6 py-8 text-center text-text-tertiary",
              children: "No tasks yet"
            }) : stats.recentTasks.map((task) => /* @__PURE__ */ jsxs(Link, {
              to: "/projects/$projectId",
              params: { projectId: task.projectId },
              className: "flex items-center justify-between px-6 py-3 hover:bg-surface-tertiary transition-colors",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "min-w-0",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-sm font-medium text-text-primary truncate",
                  children: task.title
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-text-tertiary",
                  children: task.project.name
                })]
              }), /* @__PURE__ */ jsx(Badge, {
                variant: task.status === "DONE" ? "success" : task.status === "IN_PROGRESS" ? "info" : "default",
                children: task.status.replace("_", " ")
              })]
            }, task.id))
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          padding: false,
          children: [/* @__PURE__ */ jsx("div", {
            className: "px-6 py-4 border-b border-border",
            children: /* @__PURE__ */ jsxs("h2", {
              className: "text-lg font-semibold text-text-primary flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-text-tertiary" }), "Due Soon"]
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "divide-y divide-border",
            children: stats.dueSoonTasks.length === 0 ? /* @__PURE__ */ jsx("p", {
              className: "px-6 py-8 text-center text-text-tertiary",
              children: "No upcoming deadlines"
            }) : stats.dueSoonTasks.map((task) => /* @__PURE__ */ jsxs(Link, {
              to: "/projects/$projectId",
              params: { projectId: task.projectId },
              className: "flex items-center justify-between px-6 py-3 hover:bg-surface-tertiary transition-colors",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "min-w-0",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-sm font-medium text-text-primary truncate",
                  children: task.title
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-text-tertiary",
                  children: task.project.name
                })]
              }), /* @__PURE__ */ jsx("span", {
                className: "text-xs text-text-secondary whitespace-nowrap ml-2",
                children: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""
              })]
            }, task.id))
          })]
        })]
      }),
      /* @__PURE__ */ jsxs(Card, {
        className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
          className: "text-lg font-semibold text-text-primary",
          children: "Need a fuller view?"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-text-secondary",
          children: "Open your projects to manage tasks, assignees, and project members."
        })] }), /* @__PURE__ */ jsxs(Link, {
          to: "/projects",
          className: "inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-800",
          children: ["Go to Projects", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
        })]
      })
    ]
  });
}

export { DashboardPage as component };
//# sourceMappingURL=dashboard-D9EpoHid.mjs.map
