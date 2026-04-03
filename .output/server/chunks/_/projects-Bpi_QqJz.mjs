import { x as createServerRpc, y as createServerFn, A as prisma, z as getSupabaseServerClient } from './ssr.mjs';
import { ProjectRole } from '@prisma/client';
import '@tanstack/router-core/ssr/client';
import '@tanstack/router-core';
import 'tiny-invariant';
import 'tiny-warning';
import 'node:async_hooks';
import '@supabase/ssr';
import 'vinxi/http';
import 'react/jsx-runtime';
import '@tanstack/react-router';
import '@tanstack/react-router/ssr/server';
import '@tanstack/history';
import '@tanstack/router-core/ssr/server';

async function getAuthUser() {
  const { data: { user } } = await getSupabaseServerClient().auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
var getUserProjects_createServerFn_handler = createServerRpc("src_server_projects_ts--getUserProjects_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getUserProjects.__executeServer(opts, signal);
});
var getProject_createServerFn_handler = createServerRpc("src_server_projects_ts--getProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getProject.__executeServer(opts, signal);
});
var createProject_createServerFn_handler = createServerRpc("src_server_projects_ts--createProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return createProject.__executeServer(opts, signal);
});
var updateProject_createServerFn_handler = createServerRpc("src_server_projects_ts--updateProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return updateProject.__executeServer(opts, signal);
});
var deleteProject_createServerFn_handler = createServerRpc("src_server_projects_ts--deleteProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return deleteProject.__executeServer(opts, signal);
});
var addProjectMember_createServerFn_handler = createServerRpc("src_server_projects_ts--addProjectMember_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return addProjectMember.__executeServer(opts, signal);
});
var removeProjectMember_createServerFn_handler = createServerRpc("src_server_projects_ts--removeProjectMember_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return removeProjectMember.__executeServer(opts, signal);
});
var getUserProjects = createServerFn({ method: "GET" }).handler(getUserProjects_createServerFn_handler, async () => {
  const authUser = await getAuthUser();
  return (await prisma.projectMember.findMany({
    where: { userId: authUser.id },
    include: { project: { include: { _count: { select: { tasks: true } } } } },
    orderBy: { project: { updatedAt: "desc" } }
  })).map((m) => ({
    ...m.project,
    role: m.role
  }));
});
var getProject = createServerFn({ method: "GET" }).validator((data) => data).handler(getProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership) throw new Error("Not a member of this project");
  return {
    ...await prisma.project.findUniqueOrThrow({
      where: { id: data.projectId },
      include: {
        members: {
          include: { user: true },
          orderBy: { createdAt: "asc" }
        },
        _count: { select: { tasks: true } }
      }
    }),
    currentUserRole: membership.role
  };
});
var createProject = createServerFn({ method: "POST" }).validator((data) => data).handler(createProject_createServerFn_handler, async ({ data }) => {
  var _a, _b;
  const authUser = await getAuthUser();
  return await prisma.project.create({ data: {
    name: data.name,
    description: (_a = data.description) != null ? _a : null,
    color: (_b = data.color) != null ? _b : "#3b82f6",
    ownerId: authUser.id,
    members: { create: {
      userId: authUser.id,
      role: ProjectRole.OWNER
    } }
  } });
});
var updateProject = createServerFn({ method: "POST" }).validator((data) => data).handler(updateProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Insufficient permissions");
  return await prisma.project.update({
    where: { id: data.projectId },
    data: {
      ...data.name !== void 0 && { name: data.name },
      ...data.description !== void 0 && { description: data.description },
      ...data.color !== void 0 && { color: data.color }
    }
  });
});
var deleteProject = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || membership.role !== "OWNER") throw new Error("Only the owner can delete a project");
  await prisma.project.delete({ where: { id: data.projectId } });
  return { success: true };
});
var addProjectMember = createServerFn({ method: "POST" }).validator((data) => data).handler(addProjectMember_createServerFn_handler, async ({ data }) => {
  var _a;
  const authUser = await getAuthUser();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Insufficient permissions");
  const targetUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (!targetUser) return { error: "User not found with that email" };
  if (await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: targetUser.id
  } } })) return { error: "User is already a member" };
  await prisma.projectMember.create({ data: {
    projectId: data.projectId,
    userId: targetUser.id,
    role: (_a = data.role) != null ? _a : ProjectRole.MEMBER
  } });
  return { error: null };
});
var removeProjectMember = createServerFn({ method: "POST" }).validator((data) => data).handler(removeProjectMember_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Insufficient permissions");
  if (data.userId === authUser.id) throw new Error("Cannot remove yourself");
  await prisma.projectMember.delete({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: data.userId
  } } });
  return { success: true };
});

export { addProjectMember_createServerFn_handler, createProject_createServerFn_handler, deleteProject_createServerFn_handler, getProject_createServerFn_handler, getUserProjects_createServerFn_handler, removeProjectMember_createServerFn_handler, updateProject_createServerFn_handler };
//# sourceMappingURL=projects-Bpi_QqJz.mjs.map
