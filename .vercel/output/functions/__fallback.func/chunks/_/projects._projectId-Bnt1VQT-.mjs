import { d as Route } from './routeTree.gen-ZPSO4hcL.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { Link, Outlet } from '@tanstack/react-router';
import { ChevronLeft, Columns3, Settings } from 'lucide-react';
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

function ProjectLayout() {
  const project = Route.useLoaderData();
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-6xl mx-auto space-y-4",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "provisioners-glass flex items-center justify-between rounded-[24px] px-5 py-4",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-3",
        children: [
          /* @__PURE__ */ jsx(Link, {
            to: "/projects",
            className: "p-1.5 rounded-lg hover:bg-surface-tertiary text-text-secondary",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-5 w-5" })
          }),
          /* @__PURE__ */ jsx("div", {
            className: "h-8 w-8 rounded-lg",
            style: { backgroundColor: project.color }
          }),
          /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
            className: "text-xl font-bold text-text-primary",
            children: project.name
          }), project.description && /* @__PURE__ */ jsx("p", {
            className: "text-sm text-text-secondary",
            children: project.description
          })] })
        ]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-1 bg-surface/70 border border-border rounded-2xl p-1",
        children: [/* @__PURE__ */ jsxs(Link, {
          to: "/projects/$projectId",
          params: { projectId: project.id },
          activeOptions: { exact: true },
          className: "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl text-text-secondary hover:text-text-primary transition-colors [&.active]:bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))] [&.active]:text-primary-700 [&.active]:font-medium",
          children: [/* @__PURE__ */ jsx(Columns3, { className: "h-4 w-4" }), "Board"]
        }), /* @__PURE__ */ jsxs(Link, {
          to: "/projects/$projectId/settings",
          params: { projectId: project.id },
          className: "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl text-text-secondary hover:text-text-primary transition-colors [&.active]:bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))] [&.active]:text-primary-700 [&.active]:font-medium",
          children: [/* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }), "Settings"]
        })]
      })]
    }), /* @__PURE__ */ jsx(Outlet, {})]
  });
}

export { ProjectLayout as component };
//# sourceMappingURL=projects._projectId-Bnt1VQT-.mjs.map
