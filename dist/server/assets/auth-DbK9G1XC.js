import { n as createServerFn } from "../server.js";
import { a as createServerRpc, i as hasSupabaseServerEnv, r as getSupabaseServerClient, t as prisma } from "./prisma-CU-7xTI3.js";
//#region src/server/auth.ts?tss-serverfn-split
var projectRoleRank = {
	VIEWER: 0,
	MEMBER: 1,
	ADMIN: 2,
	OWNER: 3
};
async function syncUserFromAuth(authUser) {
	const email = authUser.email?.trim();
	if (!email) throw new Error("Authenticated user is missing an email address");
	const fullName = authUser.user_metadata?.full_name ?? null;
	const avatarUrl = authUser.user_metadata?.avatar_url ?? null;
	return prisma.$transaction(async (tx) => {
		const existingById = await tx.user.findUnique({ where: { id: authUser.id } });
		const existingByEmail = await tx.user.findUnique({ where: { email } });
		if (!existingById && !existingByEmail) return tx.user.create({ data: {
			id: authUser.id,
			email,
			fullName,
			avatarUrl
		} });
		if (!existingByEmail || existingByEmail.id === authUser.id) return tx.user.update({
			where: { id: authUser.id },
			data: {
				email,
				fullName,
				avatarUrl
			}
		});
		const canonicalUser = existingById ?? await tx.user.create({ data: {
			id: authUser.id,
			email: `${authUser.id}@sync.local.invalid`,
			fullName,
			avatarUrl
		} });
		const duplicateUser = existingByEmail;
		const duplicateMemberships = await tx.projectMember.findMany({ where: { userId: duplicateUser.id } });
		const canonicalMemberships = await tx.projectMember.findMany({ where: { userId: canonicalUser.id } });
		const canonicalMembershipsByProject = new Map(canonicalMemberships.map((membership) => [membership.projectId, membership]));
		for (const membership of duplicateMemberships) {
			const canonicalMembership = canonicalMembershipsByProject.get(membership.projectId);
			if (!canonicalMembership) {
				await tx.projectMember.update({
					where: { id: membership.id },
					data: { userId: canonicalUser.id }
				});
				continue;
			}
			if (projectRoleRank[membership.role] > projectRoleRank[canonicalMembership.role]) await tx.projectMember.update({
				where: { id: canonicalMembership.id },
				data: { role: membership.role }
			});
			await tx.projectMember.delete({ where: { id: membership.id } });
		}
		await tx.project.updateMany({
			where: { ownerId: duplicateUser.id },
			data: { ownerId: canonicalUser.id }
		});
		await tx.task.updateMany({
			where: { creatorId: duplicateUser.id },
			data: { creatorId: canonicalUser.id }
		});
		await tx.task.updateMany({
			where: { assigneeId: duplicateUser.id },
			data: { assigneeId: canonicalUser.id }
		});
		await tx.taskComment.updateMany({
			where: { authorId: duplicateUser.id },
			data: { authorId: canonicalUser.id }
		});
		await tx.user.delete({ where: { id: duplicateUser.id } });
		return tx.user.update({
			where: { id: canonicalUser.id },
			data: {
				email,
				fullName,
				avatarUrl
			}
		});
	});
}
var fetchUser_createServerFn_handler = createServerRpc({
	id: "6cd936469cf814c93bf346ff77d834fb61778d94cdbb977d7051b01bbb296fa0",
	name: "fetchUser",
	filename: "src/server/auth.ts"
}, (opts) => fetchUser.__executeServer(opts));
var fetchUser = createServerFn({ method: "GET" }).handler(fetchUser_createServerFn_handler, async () => {
	try {
		if (!hasSupabaseServerEnv()) return null;
		const { data: { user: authUser } } = await getSupabaseServerClient().auth.getUser();
		if (!authUser) return null;
		return await syncUserFromAuth(authUser);
	} catch (error) {
		console.error("fetchUser failed", error);
		return null;
	}
});
var loginFn_createServerFn_handler = createServerRpc({
	id: "1bd5f6beef8b8498f487d444b475ec43c130b872d5482a076588f45d1d824033",
	name: "loginFn",
	filename: "src/server/auth.ts"
}, (opts) => loginFn.__executeServer(opts));
var loginFn = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(loginFn_createServerFn_handler, async ({ data }) => {
	if (!hasSupabaseServerEnv()) return { error: "Authentication is not configured on the server. Set SUPABASE_URL and SUPABASE_ANON_KEY." };
	const { error } = await getSupabaseServerClient().auth.signInWithPassword({
		email: data.email,
		password: data.password
	});
	if (error) return { error: error.message };
	return { error: null };
});
var signupFn_createServerFn_handler = createServerRpc({
	id: "cd37bf5b44ea2939a1d7c86d72030ae9c23710e31e36522287ad7f6d0c0f944c",
	name: "signupFn",
	filename: "src/server/auth.ts"
}, (opts) => signupFn.__executeServer(opts));
var signupFn = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(signupFn_createServerFn_handler, async ({ data }) => {
	if (!hasSupabaseServerEnv()) return { error: "Authentication is not configured on the server. Set SUPABASE_URL and SUPABASE_ANON_KEY." };
	const { error } = await getSupabaseServerClient().auth.signUp({
		email: data.email,
		password: data.password,
		options: { data: { full_name: data.fullName } }
	});
	if (error) return { error: error.message };
	return { error: null };
});
var logoutFn_createServerFn_handler = createServerRpc({
	id: "9ba0115062514df0860765457c03095b2fb0bdf04c256d5c5cd841a19dca77fa",
	name: "logoutFn",
	filename: "src/server/auth.ts"
}, (opts) => logoutFn.__executeServer(opts));
var logoutFn = createServerFn({ method: "POST" }).handler(logoutFn_createServerFn_handler, async () => {
	if (!hasSupabaseServerEnv()) return { success: true };
	await getSupabaseServerClient().auth.signOut();
	return { success: true };
});
//#endregion
export { fetchUser_createServerFn_handler, loginFn_createServerFn_handler, logoutFn_createServerFn_handler, signupFn_createServerFn_handler };
