import { x as createServerRpc, y as createServerFn, z as getSupabaseServerClient, A as prisma } from './ssr.mjs';
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

var getDashboardStats_createServerFn_handler = createServerRpc("src_server_dashboard_ts--getDashboardStats_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getDashboardStats.__executeServer(opts, signal);
});
var getDashboardStats = createServerFn({ method: "GET" }).handler(getDashboardStats_createServerFn_handler, async () => {
  const { data: { user } } = await getSupabaseServerClient().auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const projectIds = (await prisma.projectMember.findMany({
    where: { userId: user.id },
    select: { projectId: true }
  })).map((m) => m.projectId);
  const [totalTasks, completedTasks, overdueTasks, recentTasks, dueSoonTasks] = await Promise.all([
    prisma.task.count({ where: { projectId: { in: projectIds } } }),
    prisma.task.count({ where: {
      projectId: { in: projectIds },
      status: "DONE"
    } }),
    prisma.task.count({ where: {
      projectId: { in: projectIds },
      status: { notIn: ["DONE", "CANCELLED"] },
      dueDate: { lt: /* @__PURE__ */ new Date() }
    } }),
    prisma.task.findMany({
      where: { projectId: { in: projectIds } },
      include: { project: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.task.findMany({
      where: {
        projectId: { in: projectIds },
        status: { notIn: ["DONE", "CANCELLED"] },
        dueDate: {
          gte: /* @__PURE__ */ new Date(),
          lte: new Date(Date.now() + 10080 * 60 * 1e3)
        }
      },
      include: { project: { select: { name: true } } },
      orderBy: { dueDate: "asc" },
      take: 8
    })
  ]);
  return {
    totalProjects: projectIds.length,
    totalTasks,
    completedTasks,
    overdueTasks,
    recentTasks,
    dueSoonTasks
  };
});

export { getDashboardStats_createServerFn_handler };
//# sourceMappingURL=dashboard-C1bHzooA.mjs.map
