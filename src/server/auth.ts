import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { ProjectRole } from '@prisma/client'

const projectRoleRank: Record<ProjectRole, number> = {
  VIEWER: 0,
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3,
}

async function syncUserFromAuth(authUser: {
  id: string
  email?: string | null
  user_metadata?: {
    full_name?: string | null
    avatar_url?: string | null
  }
}) {
  const email = authUser.email?.trim()
  if (!email) {
    throw new Error('Authenticated user is missing an email address')
  }

  const fullName = authUser.user_metadata?.full_name ?? null
  const avatarUrl = authUser.user_metadata?.avatar_url ?? null

  return prisma.$transaction(async (tx) => {
    const existingById = await tx.user.findUnique({
      where: { id: authUser.id },
    })
    const existingByEmail = await tx.user.findUnique({
      where: { email },
    })

    if (!existingById && !existingByEmail) {
      return tx.user.create({
        data: {
          id: authUser.id,
          email,
          fullName,
          avatarUrl,
        },
      })
    }

    if (!existingByEmail || existingByEmail.id === authUser.id) {
      return tx.user.update({
        where: { id: authUser.id },
        data: {
          email,
          fullName,
          avatarUrl,
        },
      })
    }

    const canonicalUser =
      existingById ??
      await tx.user.create({
        data: {
          id: authUser.id,
          email: `${authUser.id}@sync.local.invalid`,
          fullName,
          avatarUrl,
        },
      })

    const duplicateUser = existingByEmail

    const duplicateMemberships = await tx.projectMember.findMany({
      where: { userId: duplicateUser.id },
    })
    const canonicalMemberships = await tx.projectMember.findMany({
      where: { userId: canonicalUser.id },
    })

    const canonicalMembershipsByProject = new Map(
      canonicalMemberships.map((membership) => [membership.projectId, membership]),
    )

    for (const membership of duplicateMemberships) {
      const canonicalMembership = canonicalMembershipsByProject.get(membership.projectId)

      if (!canonicalMembership) {
        await tx.projectMember.update({
          where: { id: membership.id },
          data: { userId: canonicalUser.id },
        })
        continue
      }

      if (projectRoleRank[membership.role] > projectRoleRank[canonicalMembership.role]) {
        await tx.projectMember.update({
          where: { id: canonicalMembership.id },
          data: { role: membership.role },
        })
      }

      await tx.projectMember.delete({
        where: { id: membership.id },
      })
    }

    await tx.project.updateMany({
      where: { ownerId: duplicateUser.id },
      data: { ownerId: canonicalUser.id },
    })
    await tx.task.updateMany({
      where: { creatorId: duplicateUser.id },
      data: { creatorId: canonicalUser.id },
    })
    await tx.task.updateMany({
      where: { assigneeId: duplicateUser.id },
      data: { assigneeId: canonicalUser.id },
    })
    await tx.taskComment.updateMany({
      where: { authorId: duplicateUser.id },
      data: { authorId: canonicalUser.id },
    })

    await tx.user.delete({
      where: { id: duplicateUser.id },
    })

    return tx.user.update({
      where: { id: canonicalUser.id },
      data: {
        email,
        fullName,
        avatarUrl,
      },
    })
  })
}

export const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return null

  const user = await syncUserFromAuth(authUser)

  return user
})

export const loginFn = createServerFn({ method: 'POST' })
  .validator(
    (data: { email: string; password: string }) => data,
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  })

export const signupFn = createServerFn({ method: 'POST' })
  .validator(
    (data: { email: string; password: string; fullName: string }) => data,
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  await supabase.auth.signOut()
  return { success: true }
})
