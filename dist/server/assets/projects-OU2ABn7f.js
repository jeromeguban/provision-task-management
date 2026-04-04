import { n as createServerFn } from "../server.js";
import { a as createServerRpc, n as ProjectRole, r as getSupabaseServerClient, t as prisma } from "./prisma-CU-7xTI3.js";
//#region src/server/projects.ts?tss-serverfn-split
async function getAuthUser() {
	const { data: { user } } = await getSupabaseServerClient().auth.getUser();
	if (!user) throw new Error("Unauthorized");
	return user;
}
var getUserProjects_createServerFn_handler = createServerRpc({
	id: "6dade6aad0b83e32273dedb240c63f5169649c74ce4f50dfee7cd28af6d1d4db",
	name: "getUserProjects",
	filename: "src/server/projects.ts"
}, (opts) => getUserProjects.__executeServer(opts));
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
var getProject_createServerFn_handler = createServerRpc({
	id: "0ef74326a5824c919c0259568e0bd5aa072fcba8ef27f40999ce5806d6baf0d1",
	name: "getProject",
	filename: "src/server/projects.ts"
}, (opts) => getProject.__executeServer(opts));
var getProject = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(getProject_createServerFn_handler, async ({ data }) => {
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
var createProject_createServerFn_handler = createServerRpc({
	id: "5c086309e3adf1cf08705ff24355fff50f75d23ae63e4c2852d7ae44b3405e8a",
	name: "createProject",
	filename: "src/server/projects.ts"
}, (opts) => createProject.__executeServer(opts));
var createProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createProject_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	return await prisma.project.create({ data: {
		name: data.name,
		description: data.description ?? null,
		color: data.color ?? "#3b82f6",
		ownerId: authUser.id,
		members: { create: {
			userId: authUser.id,
			role: ProjectRole.OWNER
		} }
	} });
});
var updateProject_createServerFn_handler = createServerRpc({
	id: "90f66bf88a90f89728e9ca4216b40dc46468bfded426015eb9bf626a9bc79690",
	name: "updateProject",
	filename: "src/server/projects.ts"
}, (opts) => updateProject.__executeServer(opts));
var updateProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(updateProject_createServerFn_handler, async ({ data }) => {
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
var deleteProject_createServerFn_handler = createServerRpc({
	id: "ac9aa40c7a11203f7df71da777fdcfc5fb81276636a3c9f904c150c900958276",
	name: "deleteProject",
	filename: "src/server/projects.ts"
}, (opts) => deleteProject.__executeServer(opts));
var deleteProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(deleteProject_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
		projectId: data.projectId,
		userId: authUser.id
	} } });
	if (!membership || membership.role !== "OWNER") throw new Error("Only the owner can delete a project");
	await prisma.project.delete({ where: { id: data.projectId } });
	return { success: true };
});
var addProjectMember_createServerFn_handler = createServerRpc({
	id: "c7d7d9a5769882a61f0bbd0c19a38cc7056f029bd07b19b4c92f332f6446a1e8",
	name: "addProjectMember",
	filename: "src/server/projects.ts"
}, (opts) => addProjectMember.__executeServer(opts));
var addProjectMember = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(addProjectMember_createServerFn_handler, async ({ data }) => {
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
		role: data.role ?? ProjectRole.MEMBER
	} });
	return { error: null };
});
var removeProjectMember_createServerFn_handler = createServerRpc({
	id: "75104de216cf8087e295f8646d9f35b71b76943cbde8473ce83256e2be698721",
	name: "removeProjectMember",
	filename: "src/server/projects.ts"
}, (opts) => removeProjectMember.__executeServer(opts));
var removeProjectMember = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(removeProjectMember_createServerFn_handler, async ({ data }) => {
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
//#endregion
export { addProjectMember_createServerFn_handler, createProject_createServerFn_handler, deleteProject_createServerFn_handler, getProject_createServerFn_handler, getUserProjects_createServerFn_handler, removeProjectMember_createServerFn_handler, updateProject_createServerFn_handler };
