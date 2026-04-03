import { g as getUserProjects, a as logoutFn } from './routeTree.gen-B1ahvekk.mjs';
import { A as Avatar } from './Avatar-JXfAfazU.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Outlet, useParams, Link, useRouteContext, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, createContext, useContext } from 'react';
import { CheckSquare, X, LayoutDashboard, FolderKanban, Plus, Settings, Menu, Sun, Moon, LogOut } from 'lucide-react';
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
import 'vite';
import '@vitejs/plugin-react';
import '@tanstack/react-start/plugin/vite';
import '@tailwindcss/vite';
import 'node:fs';
import 'node:path';
import '@supabase/ssr';
import '@prisma/client';

function Sidebar({ open, onClose }) {
  const [projects, setProjects] = useState([]);
  const params = useParams({ strict: false });
  useEffect(() => {
    getUserProjects().then(setProjects).catch(() => {
    });
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [open && /* @__PURE__ */ jsx("div", {
    className: "fixed inset-0 bg-black/50 z-40 lg:hidden animate-overlay-in",
    onClick: onClose
  }), /* @__PURE__ */ jsxs("aside", {
    className: `fixed lg:static inset-y-0 left-0 z-50 w-72 provisioners-glass border-r border-border flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`,
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "h-16 flex items-center justify-between px-5 border-b border-border shrink-0",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/dashboard",
          className: "flex items-center gap-3",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] text-white shadow-[0_18px_34px_rgba(168,85,247,0.24)]",
            children: /* @__PURE__ */ jsx(CheckSquare, { className: "h-4.5 w-4.5" })
          }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
            className: "text-[10px] font-semibold uppercase tracking-[0.24em] text-text-tertiary",
            children: "Workspace"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-base font-semibold text-text-primary",
            children: "ProVisioners"
          })] })]
        }), /* @__PURE__ */ jsx("button", {
          onClick: onClose,
          className: "lg:hidden p-1 rounded-md hover:bg-surface-tertiary text-text-tertiary",
          children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
        })]
      }),
      /* @__PURE__ */ jsxs("nav", {
        className: "flex-1 overflow-y-auto p-4 space-y-1.5",
        children: [
          /* @__PURE__ */ jsxs(Link, {
            to: "/dashboard",
            className: "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors [&.active]:bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))] [&.active]:text-primary-700 [&.active]:shadow-sm",
            onClick: onClose,
            children: [/* @__PURE__ */ jsx(LayoutDashboard, { className: "h-4 w-4" }), "Dashboard"]
          }),
          /* @__PURE__ */ jsxs(Link, {
            to: "/projects",
            className: "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors [&.active]:bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))] [&.active]:text-primary-700 [&.active]:shadow-sm",
            onClick: onClose,
            children: [/* @__PURE__ */ jsx(FolderKanban, { className: "h-4 w-4" }), "All Projects"]
          }),
          /* @__PURE__ */ jsxs("div", {
            className: "pt-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-between px-3.5 mb-2",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-xs font-semibold text-text-tertiary uppercase tracking-wider",
                children: "Projects"
              }), /* @__PURE__ */ jsx(Link, {
                to: "/projects/new",
                className: "p-1 rounded hover:bg-surface-tertiary text-text-tertiary hover:text-text-primary transition-colors",
                onClick: onClose,
                children: /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" })
              })]
            }), projects.length === 0 ? /* @__PURE__ */ jsx("p", {
              className: "px-3.5 py-2 text-xs text-text-tertiary",
              children: "No projects yet"
            }) : projects.map((project) => /* @__PURE__ */ jsxs(Link, {
              to: "/projects/$projectId",
              params: { projectId: project.id },
              className: `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors ${params.projectId === project.id ? "bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))] text-primary-700 shadow-sm" : ""}`,
              onClick: onClose,
              children: [
                /* @__PURE__ */ jsx("div", {
                  className: "h-3 w-3 rounded-sm shrink-0",
                  style: { backgroundColor: project.color }
                }),
                /* @__PURE__ */ jsx("span", {
                  className: "truncate",
                  children: project.name
                }),
                /* @__PURE__ */ jsx("span", {
                  className: "ml-auto text-xs text-text-tertiary",
                  children: project._count.tasks
                })
              ]
            }, project.id))]
          })
        ]
      }),
      /* @__PURE__ */ jsx("div", {
        className: "p-4 border-t border-border",
        children: /* @__PURE__ */ jsxs(Link, {
          to: "/projects",
          className: "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors",
          onClick: onClose,
          children: [/* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }), "Manage Projects"]
        })
      })
    ]
  })] });
}
var ThemeContext = createContext({
  dark: false,
  toggle: () => {
  }
});
function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    return false;
  });
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);
  return /* @__PURE__ */ jsx(ThemeContext.Provider, {
    value: {
      dark,
      toggle: () => setDark((d) => !d)
    },
    children
  });
}
var useTheme = () => useContext(ThemeContext);
function Header({ onToggleSidebar }) {
  const { user } = useRouteContext({ from: "/_authed" });
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const handleLogout = async () => {
    await logoutFn();
    navigate({ to: "/login" });
  };
  return /* @__PURE__ */ jsxs("header", {
    className: "provisioners-glass h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-3",
      children: [/* @__PURE__ */ jsx("button", {
        onClick: onToggleSidebar,
        className: "lg:hidden p-1.5 rounded-md hover:bg-surface-tertiary text-text-secondary",
        children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-2 lg:hidden",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex h-8 w-8 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] text-white",
          children: /* @__PURE__ */ jsx(CheckSquare, { className: "h-4 w-4" })
        }), /* @__PURE__ */ jsx("span", {
          className: "font-semibold text-text-primary",
          children: "ProVisioners"
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex items-center gap-2",
      children: [/* @__PURE__ */ jsx("button", {
        onClick: toggle,
        "aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
        className: "p-2 rounded-xl hover:bg-surface-tertiary text-text-secondary hover:text-text-primary transition-colors duration-150",
        children: dark ? /* @__PURE__ */ jsx(Sun, { className: "h-4.5 w-4.5" }) : /* @__PURE__ */ jsx(Moon, { className: "h-4.5 w-4.5" })
      }), /* @__PURE__ */ jsxs("div", {
        className: "relative",
        children: [/* @__PURE__ */ jsxs("button", {
          onClick: () => setShowMenu(!showMenu),
          className: "flex items-center gap-2 hover:bg-surface-tertiary rounded-xl px-2 py-1.5 transition-colors",
          children: [/* @__PURE__ */ jsx(Avatar, {
            name: user.fullName,
            src: user.avatarUrl,
            size: "sm"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-sm font-medium text-text-primary hidden sm:block",
            children: user.fullName || user.email
          })]
        }), showMenu && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
          className: "fixed inset-0 z-40",
          onClick: () => setShowMenu(false)
        }), /* @__PURE__ */ jsxs("div", {
          className: "provisioners-glass absolute right-0 top-full mt-2 z-50 rounded-2xl py-1 w-56",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "px-3 py-2 border-b border-border",
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium text-text-primary",
              children: user.fullName
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs text-text-tertiary truncate",
              children: user.email
            })]
          }), /* @__PURE__ */ jsxs("button", {
            onClick: handleLogout,
            className: "w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors",
            children: [/* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), "Sign out"]
          })]
        })] })]
      })]
    })]
  });
}
function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsxs("div", {
    className: "provisioners-app-shell h-screen flex overflow-hidden bg-surface-secondary",
    children: [/* @__PURE__ */ jsx(Sidebar, {
      open: sidebarOpen,
      onClose: () => setSidebarOpen(false)
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex-1 flex flex-col overflow-hidden",
      children: [/* @__PURE__ */ jsx(Header, { onToggleSidebar: () => setSidebarOpen(!sidebarOpen) }), /* @__PURE__ */ jsx("main", {
        className: "flex-1 overflow-y-auto p-6 lg:p-8",
        children
      })]
    })]
  }) });
}
function AuthedLayout() {
  return /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}

export { AuthedLayout as component };
//# sourceMappingURL=_authed-DEHHDHqU.mjs.map
