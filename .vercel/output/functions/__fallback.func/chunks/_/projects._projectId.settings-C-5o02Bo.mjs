import { p as Route, q as updateProject, r as addProjectMember, t as getProject, v as removeProjectMember, w as deleteProject } from './routeTree.gen-BxSkGuzs.mjs';
import { A as Avatar } from './Avatar-JXfAfazU.mjs';
import { C as Card } from './Card-jDSerDDM.mjs';
import { B as Badge } from './Badge-Dd7uaF2k.mjs';
import { B as Button } from './Button-B2JAha6z.mjs';
import { I as Input } from './Input-X3bnvCFm.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useNavigate, getRouteApi } from '@tanstack/react-router';
import { useState } from 'react';
import { UserPlus, X, Trash2 } from 'lucide-react';
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

var projectRouteApi = getRouteApi("/_authed/projects/$projectId");
var PROJECT_COLORS = [
  "#7c3aed",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#6366f1"
];
function ProjectSettingsPage() {
  var _a;
  const navigate = useNavigate();
  const project = projectRouteApi.useLoaderData();
  const { projectId } = Route.useParams();
  const [projectData, setProjectData] = useState(project);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState((_a = project.description) != null ? _a : "");
  const [color, setColor] = useState(project.color);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const isOwnerOrAdmin = ["OWNER", "ADMIN"].includes(projectData.currentUserRole);
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedProject = await updateProject({ data: {
      projectId,
      name,
      description,
      color
    } });
    setProjectData((currentProject) => ({
      ...currentProject,
      ...updatedProject
    }));
    setLoading(false);
    navigate({
      to: "/projects/$projectId",
      params: { projectId },
      replace: true
    });
  };
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    await deleteProject({ data: { projectId } });
    navigate({ to: "/projects" });
  };
  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError(null);
    setInviteLoading(true);
    const result = await addProjectMember({ data: {
      projectId,
      email: inviteEmail
    } });
    if (result.error) setInviteError(result.error);
    else {
      setInviteEmail("");
      setProjectData(await getProject({ data: { projectId } }));
    }
    setInviteLoading(false);
  };
  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member from the project?")) return;
    await removeProjectMember({ data: {
      projectId,
      userId
    } });
    setProjectData(await getProject({ data: { projectId } }));
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6 max-w-2xl",
    children: [
      /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx("h2", {
        className: "text-lg font-semibold text-text-primary mb-4",
        children: "Project Details"
      }), /* @__PURE__ */ jsxs("form", {
        onSubmit: handleUpdate,
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsx(Input, {
            id: "name",
            label: "Project name",
            value: name,
            onChange: (e) => setName(e.target.value),
            disabled: !isOwnerOrAdmin,
            required: true
          }),
          /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
            className: "block text-sm font-medium text-text-secondary mb-1.5",
            children: "Description"
          }), /* @__PURE__ */ jsx("textarea", {
            value: description,
            onChange: (e) => setDescription(e.target.value),
            disabled: !isOwnerOrAdmin,
            rows: 3,
            className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface text-text-primary placeholder:text-text-tertiary resize-none disabled:opacity-50"
          })] }),
          /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
            className: "block text-sm font-medium text-text-secondary mb-2",
            children: "Color"
          }), /* @__PURE__ */ jsx("div", {
            className: "flex flex-wrap gap-2",
            children: PROJECT_COLORS.map((c) => /* @__PURE__ */ jsx("button", {
              type: "button",
              onClick: () => isOwnerOrAdmin && setColor(c),
              className: `h-8 w-8 rounded-full border-2 transition-all ${color === c ? "border-text-primary scale-110" : "border-transparent"} ${!isOwnerOrAdmin ? "opacity-50 cursor-not-allowed" : ""}`,
              style: { backgroundColor: c }
            }, c))
          })] }),
          isOwnerOrAdmin && /* @__PURE__ */ jsx(Button, {
            type: "submit",
            disabled: loading,
            children: loading ? "Saving..." : "Save Changes"
          })
        ]
      })] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx("h2", {
          className: "text-lg font-semibold text-text-primary mb-4",
          children: "Members"
        }),
        isOwnerOrAdmin && /* @__PURE__ */ jsxs("form", {
          onSubmit: handleInvite,
          className: "flex gap-2 mb-4",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex-1",
            children: /* @__PURE__ */ jsx(Input, {
              value: inviteEmail,
              onChange: (e) => setInviteEmail(e.target.value),
              placeholder: "Enter email to invite",
              type: "email",
              error: inviteError != null ? inviteError : void 0,
              required: true
            })
          }), /* @__PURE__ */ jsxs(Button, {
            type: "submit",
            disabled: inviteLoading,
            className: "shrink-0",
            children: [/* @__PURE__ */ jsx(UserPlus, { className: "h-4 w-4" }), inviteLoading ? "Inviting..." : "Invite"]
          })]
        }),
        /* @__PURE__ */ jsx("div", {
          className: "divide-y divide-border",
          children: projectData.members.map((member) => /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between py-3",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-3",
              children: [/* @__PURE__ */ jsx(Avatar, {
                name: member.user.fullName,
                src: member.user.avatarUrl,
                size: "sm"
              }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm font-medium text-text-primary",
                children: member.user.fullName || member.user.email
              }), /* @__PURE__ */ jsx("p", {
                className: "text-xs text-text-tertiary",
                children: member.user.email
              })] })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Badge, {
                variant: member.role === "OWNER" ? "primary" : member.role === "ADMIN" ? "info" : "default",
                children: member.role
              }), isOwnerOrAdmin && member.role !== "OWNER" && /* @__PURE__ */ jsx("button", {
                onClick: () => handleRemoveMember(member.userId),
                className: "p-1 rounded hover:bg-rose-50 text-text-tertiary hover:text-rose-500 transition-colors",
                children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
              })]
            })]
          }, member.id))
        })
      ] }),
      projectData.currentUserRole === "OWNER" && /* @__PURE__ */ jsxs(Card, {
        className: "border-rose-200",
        children: [
          /* @__PURE__ */ jsx("h2", {
            className: "text-lg font-semibold text-rose-600 mb-2",
            children: "Danger Zone"
          }),
          /* @__PURE__ */ jsx("p", {
            className: "text-sm text-text-secondary mb-4",
            children: "Deleting this project will permanently remove all tasks and data."
          }),
          /* @__PURE__ */ jsxs(Button, {
            variant: "danger",
            onClick: handleDelete,
            children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), "Delete Project"]
          })
        ]
      })
    ]
  });
}

export { ProjectSettingsPage as component };
//# sourceMappingURL=projects._projectId.settings-C-5o02Bo.mjs.map
