import { n as createServerFn } from "../server.js";
import { a as createServerRpc, r as getSupabaseServerClient, t as prisma } from "./prisma-CU-7xTI3.js";
//#region src/server/dashboard.ts?tss-serverfn-split
var getDashboardStats_createServerFn_handler = createServerRpc({
	id: "d2a532663c89b9c60f7f8fd65bef42bbd4459841f668dd3a041cedd2c1e087cb",
	name: "getDashboardStats",
	filename: "src/server/dashboard.ts"
}, (opts) => getDashboardStats.__executeServer(opts));
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
//#endregion
export { getDashboardStats_createServerFn_handler };
