import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { ProjectRole } from '@/generated/prisma/client'

async function getAuthUser() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export const getUserProjects = createServerFn({ method: 'GET' }).handler(async () => {
  const authUser = await getAuthUser()

  const memberships = await prisma.projectMember.findMany({
    where: { userId: authUser.id },
    include: {
      project: {
        include: {
          _count: { select: { tasks: true } },
        },
      },
    },
    orderBy: { project: { updatedAt: 'desc' } },
  })

  return memberships.map((m) => ({
    ...m.project,
    role: m.role,
  }))
})

export const getProject = createServerFn({ method: 'GET' })
  .inputValidator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: authUser.id,
        },
      },
    })

    if (!membership) throw new Error('Not a member of this project')

    const project = await prisma.project.findUniqueOrThrow({
      where: { id: data.projectId },
      include: {
        members: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { tasks: true } },
      },
    })

    return { ...project, currentUserRole: membership.role }
  })

export const createProject = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { name: string; description?: string; color?: string }) => data,
  )
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        color: data.color ?? '#3b82f6',
        ownerId: authUser.id,
        members: {
          create: {
            userId: authUser.id,
            role: ProjectRole.OWNER,
          },
        },
      },
    })

    return project
  })

export const updateProject = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { projectId: string; name?: string; description?: string; color?: string }) => data,
  )
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: authUser.id,
        },
      },
    })

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      throw new Error('Insufficient permissions')
    }

    const project = await prisma.project.update({
      where: { id: data.projectId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.color !== undefined && { color: data.color }),
      },
    })

    return project
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .inputValidator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: authUser.id,
        },
      },
    })

    if (!membership || membership.role !== 'OWNER') {
      throw new Error('Only the owner can delete a project')
    }

    await prisma.project.delete({ where: { id: data.projectId } })
    return { success: true }
  })

export const addProjectMember = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { projectId: string; email: string; role?: ProjectRole }) => data,
  )
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: authUser.id,
        },
      },
    })

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      throw new Error('Insufficient permissions')
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!targetUser) {
      return { error: 'User not found with that email' }
    }

    const existing = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: targetUser.id,
        },
      },
    })

    if (existing) {
      return { error: 'User is already a member' }
    }

    await prisma.projectMember.create({
      data: {
        projectId: data.projectId,
        userId: targetUser.id,
        role: data.role ?? ProjectRole.MEMBER,
      },
    })

    return { error: null }
  })

export const removeProjectMember = createServerFn({ method: 'POST' })
  .inputValidator((data: { projectId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: authUser.id,
        },
      },
    })

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      throw new Error('Insufficient permissions')
    }

    if (data.userId === authUser.id) {
      throw new Error('Cannot remove yourself')
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: data.userId,
        },
      },
    })

    return { success: true }
  })
