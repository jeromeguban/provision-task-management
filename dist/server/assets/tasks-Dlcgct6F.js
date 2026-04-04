import { n as createServerFn } from "../server.js";
import { a as createServerRpc, r as getSupabaseServerClient, t as prisma } from "./prisma-CU-7xTI3.js";
//#region src/server/tasks.ts?tss-serverfn-split
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
var getTasksByProject_createServerFn_handler = createServerRpc({
	id: "d7cfe62b8f99c0291446cd44deb05eb988dd976410e10815adbca16c3f823ebb",
	name: "getTasksByProject",
	filename: "src/server/tasks.ts"
}, (opts) => getTasksByProject.__executeServer(opts));
var getTasksByProject = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(getTasksByProject_createServerFn_handler, async ({ data }) => {
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
var getTask_createServerFn_handler = createServerRpc({
	id: "d5136516627e43f5cf88d87ebdfdcf49a5d21cb2b7292bd9595786d7490eaa5a",
	name: "getTask",
	filename: "src/server/tasks.ts"
}, (opts) => getTask.__executeServer(opts));
var getTask = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(getTask_createServerFn_handler, async ({ data }) => {
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
var createTask_createServerFn_handler = createServerRpc({
	id: "ccd5837fbb55ea5c73a39c5d34dcee939713168018c71faec1288bca5ac16f44",
	name: "createTask",
	filename: "src/server/tasks.ts"
}, (opts) => createTask.__executeServer(opts));
var createTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createTask_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	await requireProjectMember(data.projectId, authUser.id);
	const maxPosition = await prisma.task.aggregate({
		where: {
			projectId: data.projectId,
			status: data.status ?? "TODO"
		},
		_max: { position: true }
	});
	return prisma.task.create({
		data: {
			title: data.title,
			description: data.description ?? null,
			status: data.status ?? "TODO",
			priority: data.priority ?? "NONE",
			dueDate: data.dueDate ? new Date(data.dueDate) : null,
			position: (maxPosition._max.position ?? -1) + 1,
			projectId: data.projectId,
			creatorId: authUser.id,
			assigneeId: data.assigneeId ?? null
		},
		include: {
			creator: true,
			assignee: true
		}
	});
});
var updateTask_createServerFn_handler = createServerRpc({
	id: "9d16584b5d2a23cee36be22db89baf45e323d9328dcf410cf72f84bc38e5d42b",
	name: "updateTask",
	filename: "src/server/tasks.ts"
}, (opts) => updateTask.__executeServer(opts));
var updateTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(updateTask_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	const task = await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } });
	await requireProjectMember(task.projectId, authUser.id);
	const updateData = {};
	if (data.title !== void 0) updateData.title = data.title;
	if (data.description !== void 0) updateData.description = data.description;
	if (data.status !== void 0) {
		updateData.status = data.status;
		if (data.status !== task.status) updateData.position = ((await prisma.task.aggregate({
			where: {
				projectId: task.projectId,
				status: data.status
			},
			_max: { position: true }
		}))._max.position ?? -1) + 1;
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
var moveTask_createServerFn_handler = createServerRpc({
	id: "e60b994c8dfc1b92a1f345f4c22d06c6a2b2f900f6c8ec2a8cb2fe512cad1b9b",
	name: "moveTask",
	filename: "src/server/tasks.ts"
}, (opts) => moveTask.__executeServer(opts));
var moveTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(moveTask_createServerFn_handler, async ({ data }) => {
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
var deleteTask_createServerFn_handler = createServerRpc({
	id: "a2e0ea788cf5704df6a2eba87ddaa1012617a3df34580ea38433ee253e159865",
	name: "deleteTask",
	filename: "src/server/tasks.ts"
}, (opts) => deleteTask.__executeServer(opts));
var deleteTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(deleteTask_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	await requireProjectMember((await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } })).projectId, authUser.id);
	await prisma.task.delete({ where: { id: data.taskId } });
	return { success: true };
});
var addComment_createServerFn_handler = createServerRpc({
	id: "08563fdc09a8a98b0c3dd40d9972f382481e4a7e2535ac2f7860320d5621c134",
	name: "addComment",
	filename: "src/server/tasks.ts"
}, (opts) => addComment.__executeServer(opts));
var addComment = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(addComment_createServerFn_handler, async ({ data }) => {
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
var getProjectMembers_createServerFn_handler = createServerRpc({
	id: "331b87b1879c265c2f97a862810042d458c31af1bd32b44e5cb5225a150f864f",
	name: "getProjectMembers",
	filename: "src/server/tasks.ts"
}, (opts) => getProjectMembers.__executeServer(opts));
var getProjectMembers = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(getProjectMembers_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	await requireProjectMember(data.projectId, authUser.id);
	return prisma.projectMember.findMany({
		where: { projectId: data.projectId },
		include: { user: true }
	});
});
var deleteComment_createServerFn_handler = createServerRpc({
	id: "3e7abccfbcb21fdab1dca6fa4d16067811dc384e13886d036db4185cfb651448",
	name: "deleteComment",
	filename: "src/server/tasks.ts"
}, (opts) => deleteComment.__executeServer(opts));
var deleteComment = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(deleteComment_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	if ((await prisma.taskComment.findUniqueOrThrow({ where: { id: data.commentId } })).authorId !== authUser.id) throw new Error("Not authorized to delete this comment");
	await prisma.taskComment.delete({ where: { id: data.commentId } });
	return { success: true };
});
//#endregion
export { addComment_createServerFn_handler, createTask_createServerFn_handler, deleteComment_createServerFn_handler, deleteTask_createServerFn_handler, getProjectMembers_createServerFn_handler, getTask_createServerFn_handler, getTasksByProject_createServerFn_handler, moveTask_createServerFn_handler, updateTask_createServerFn_handler };
