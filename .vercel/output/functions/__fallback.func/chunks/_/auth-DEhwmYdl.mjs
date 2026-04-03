import { x as createServerRpc, y as createServerFn, z as hasSupabaseServerEnv, A as getSupabaseServerClient, B as prisma } from './routeTree.gen-B1ahvekk.mjs';
import '@tanstack/react-router';
import 'react/jsx-runtime';
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

var projectRoleRank = {
  VIEWER: 0,
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3
};
async function syncUserFromAuth(authUser) {
  var _a, _b, _c, _d, _e;
  const email = (_a = authUser.email) == null ? void 0 : _a.trim();
  if (!email) throw new Error("Authenticated user is missing an email address");
  const fullName = (_c = (_b = authUser.user_metadata) == null ? void 0 : _b.full_name) != null ? _c : null;
  const avatarUrl = (_e = (_d = authUser.user_metadata) == null ? void 0 : _d.avatar_url) != null ? _e : null;
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
    const canonicalUser = existingById != null ? existingById : await tx.user.create({ data: {
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
var fetchUser_createServerFn_handler = createServerRpc("src_server_auth_ts--fetchUser_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return fetchUser.__executeServer(opts, signal);
});
var loginFn_createServerFn_handler = createServerRpc("src_server_auth_ts--loginFn_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return loginFn.__executeServer(opts, signal);
});
var signupFn_createServerFn_handler = createServerRpc("src_server_auth_ts--signupFn_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return signupFn.__executeServer(opts, signal);
});
var logoutFn_createServerFn_handler = createServerRpc("src_server_auth_ts--logoutFn_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return logoutFn.__executeServer(opts, signal);
});
var fetchUser = createServerFn({ method: "GET" }).handler(fetchUser_createServerFn_handler, async () => {
  if (!hasSupabaseServerEnv()) return null;
  const { data: { user: authUser } } = await getSupabaseServerClient().auth.getUser();
  if (!authUser) return null;
  return await syncUserFromAuth(authUser);
});
var loginFn = createServerFn({ method: "POST" }).validator((data) => data).handler(loginFn_createServerFn_handler, async ({ data }) => {
  if (!hasSupabaseServerEnv()) return { error: "Authentication is not configured on the server. Set SUPABASE_URL and SUPABASE_ANON_KEY." };
  const { error } = await getSupabaseServerClient().auth.signInWithPassword({
    email: data.email,
    password: data.password
  });
  if (error) return { error: error.message };
  return { error: null };
});
var signupFn = createServerFn({ method: "POST" }).validator((data) => data).handler(signupFn_createServerFn_handler, async ({ data }) => {
  if (!hasSupabaseServerEnv()) return { error: "Authentication is not configured on the server. Set SUPABASE_URL and SUPABASE_ANON_KEY." };
  const { error } = await getSupabaseServerClient().auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { full_name: data.fullName } }
  });
  if (error) return { error: error.message };
  return { error: null };
});
var logoutFn = createServerFn({ method: "POST" }).handler(logoutFn_createServerFn_handler, async () => {
  if (!hasSupabaseServerEnv()) return { success: true };
  await getSupabaseServerClient().auth.signOut();
  return { success: true };
});

export { fetchUser_createServerFn_handler, loginFn_createServerFn_handler, logoutFn_createServerFn_handler, signupFn_createServerFn_handler };
//# sourceMappingURL=auth-DEhwmYdl.mjs.map
