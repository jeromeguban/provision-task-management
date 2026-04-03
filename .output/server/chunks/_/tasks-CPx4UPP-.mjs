import { x as createServerRpc, y as createServerFn, A as prisma, z as getSupabaseServerClient } from './ssr.mjs';
import '@tanstack/router-core/ssr/client';
import '@tanstack/router-core';
import 'tiny-invariant';
import 'tiny-warning';
import 'node:async_hooks';
import '@supabase/ssr';
import 'vinxi/http';
import '@prisma/client';
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
async function requireProjectMember(projectId, userId) {
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId,
    userId
  } } });
  if (!membership) throw new Error("Not a member of this project");
  return membership;
}
function clampIndex(index, max) {
  return Math.max(0, Math.min(index, max));
}
var getTasksByProject_createServerFn_handler = createServerRpc("src_server_tasks_ts--getTasksByProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getTasksByProject.__executeServer(opts, signal);
});
var getTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--getTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getTask.__executeServer(opts, signal);
});
var createTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--createTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return createTask.__executeServer(opts, signal);
});
var updateTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--updateTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return updateTask.__executeServer(opts, signal);
});
var moveTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--moveTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return moveTask.__executeServer(opts, signal);
});
var deleteTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--deleteTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return deleteTask.__executeServer(opts, signal);
});
var addComment_createServerFn_handler = createServerRpc("src_server_tasks_ts--addComment_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return addComment.__executeServer(opts, signal);
});
var getProjectMembers_createServerFn_handler = createServerRpc("src_server_tasks_ts--getProjectMembers_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getProjectMembers.__executeServer(opts, signal);
});
var deleteComment_createServerFn_handler = createServerRpc("src_server_tasks_ts--deleteComment_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return deleteComment.__executeServer(opts, signal);
});
var getTasksByProject = createServerFn({ method: "GET" }).validator((data) => data).handler(getTasksByProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  await requireProjectMember(data.projectId, authUser.id);
  const where = { projectId: data.projectId };
  if (data.status) where.status = data.status;
  if (data.priority) where.priority = data.priority;
  if (data.assigneeId) where.assigneeId = data.assigneeId;
  if (data.search) where.OR = [{ title: {
    contains: data.search,
    mode: "insensitive"
  } }, { description: {
    contains: data.search,
    mode: "insensitive"
  } }];
  return prisma.task.findMany({
    where,
    include: {
      creator: true,
      assignee: true,
      _count: { select: { comments: true } }
    },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }]
  });
});
var getTask = createServerFn({ method: "GET" }).validator((data) => data).handler(getTask_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  const task = await prisma.task.findUniqueOrThrow({
    where: { id: data.taskId },
    include: {
      creator: true,
      assignee: true,
      project: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" }
      }
    }
  });
  await requireProjectMember(task.projectId, authUser.id);
  return task;
});
var createTask = createServerFn({ method: "POST" }).validator((data) => data).handler(createTask_createServerFn_handler, async ({ data }) => {
  var _a, _b, _c, _d, _e, _f;
  const authUser = await getAuthUser();
  await requireProjectMember(data.projectId, authUser.id);
  const maxPosition = await prisma.task.aggregate({
    where: {
      projectId: data.projectId,
      status: (_a = data.status) != null ? _a : "TODO"
    },
    _max: { position: true }
  });
  return prisma.task.create({
    data: {
      title: data.title,
      description: (_b = data.description) != null ? _b : null,
      status: (_c = data.status) != null ? _c : "TODO",
      priority: (_d = data.priority) != null ? _d : "NONE",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      position: ((_e = maxPosition._max.position) != null ? _e : -1) + 1,
      projectId: data.projectId,
      creatorId: authUser.id,
      assigneeId: (_f = data.assigneeId) != null ? _f : null
    },
    include: {
      creator: true,
      assignee: true
    }
  });
});
var updateTask = createServerFn({ method: "POST" }).validator((data) => data).handler(updateTask_createServerFn_handler, async ({ data }) => {
  var _a;
  const authUser = await getAuthUser();
  const task = await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } });
  await requireProjectMember(task.projectId, authUser.id);
  const updateData = {};
  if (data.title !== void 0) updateData.title = data.title;
  if (data.description !== void 0) updateData.description = data.description;
  if (data.status !== void 0) {
    updateData.status = data.status;
    if (data.status !== task.status) updateData.position = ((_a = (await prisma.task.aggregate({
      where: {
        projectId: task.projectId,
        status: data.status
      },
      _max: { position: true }
    }))._max.position) != null ? _a : -1) + 1;
  }
  if (data.priority !== void 0) updateData.priority = data.priority;
  if (data.dueDate !== void 0) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.assigneeId !== void 0) updateData.assigneeId = data.assigneeId;
  return prisma.task.update({
    where: { id: data.taskId },
    data: updateData,
    include: {
      creator: true,
      assignee: true
    }
  });
});
var moveTask = createServerFn({ method: "POST" }).validator((data) => data).handler(moveTask_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  await requireProjectMember((await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } })).projectId, authUser.id);
  return prisma.$transaction(async (tx) => {
    const currentTask = await tx.task.findUniqueOrThrow({ where: { id: data.taskId } });
    const sourceWithoutCurrent = (await tx.task.findMany({
      where: {
        projectId: currentTask.projectId,
        status: currentTask.status
      },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }]
    })).filter((sourceTask) => sourceTask.id !== currentTask.id);
    if (currentTask.status === data.targetStatus) {
      const nextIndex = clampIndex(data.targetIndex, sourceWithoutCurrent.length);
      const reorderedTasks = [
        ...sourceWithoutCurrent.slice(0, nextIndex),
        currentTask,
        ...sourceWithoutCurrent.slice(nextIndex)
      ];
      await Promise.all(reorderedTasks.map((reorderedTask, index) => tx.task.update({
        where: { id: reorderedTask.id },
        data: { position: index }
      })));
    } else {
      const targetTasks = await tx.task.findMany({
        where: {
          projectId: currentTask.projectId,
          status: data.targetStatus
        },
        orderBy: [{ position: "asc" }, { createdAt: "asc" }]
      });
      const nextIndex = clampIndex(data.targetIndex, targetTasks.length);
      const reorderedTargetTasks = [
        ...targetTasks.slice(0, nextIndex),
        currentTask,
        ...targetTasks.slice(nextIndex)
      ];
      await Promise.all([...sourceWithoutCurrent.map((sourceTask, index) => tx.task.update({
        where: { id: sourceTask.id },
        data: { position: index }
      })), ...reorderedTargetTasks.map((targetTask, index) => tx.task.update({
        where: { id: targetTask.id },
        data: targetTask.id === currentTask.id ? {
          status: data.targetStatus,
          position: index
        } : { position: index }
      }))]);
    }
    return tx.task.findUniqueOrThrow({
      where: { id: data.taskId },
      include: {
        creator: true,
        assignee: true,
        _count: { select: { comments: true } }
      }
    });
  });
});
var deleteTask = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteTask_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  await requireProjectMember((await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } })).projectId, authUser.id);
  await prisma.task.delete({ where: { id: data.taskId } });
  return { success: true };
});
var addComment = createServerFn({ method: "POST" }).validator((data) => data).handler(addComment_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  await requireProjectMember((await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } })).projectId, authUser.id);
  return prisma.taskComment.create({
    data: {
      content: data.content,
      taskId: data.taskId,
      authorId: authUser.id
    },
    include: { author: true }
  });
});
var getProjectMembers = createServerFn({ method: "GET" }).validator((data) => data).handler(getProjectMembers_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  await requireProjectMember(data.projectId, authUser.id);
  return prisma.projectMember.findMany({
    where: { projectId: data.projectId },
    include: { user: true }
  });
});
var deleteComment = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteComment_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser();
  if ((await prisma.taskComment.findUniqueOrThrow({ where: { id: data.commentId } })).authorId !== authUser.id) throw new Error("Not authorized to delete this comment");
  await prisma.taskComment.delete({ where: { id: data.commentId } });
  return { success: true };
});

export { addComment_createServerFn_handler, createTask_createServerFn_handler, deleteComment_createServerFn_handler, deleteTask_createServerFn_handler, getProjectMembers_createServerFn_handler, getTask_createServerFn_handler, getTasksByProject_createServerFn_handler, moveTask_createServerFn_handler, updateTask_createServerFn_handler };
//# sourceMappingURL=tasks-CPx4UPP-.mjs.map
