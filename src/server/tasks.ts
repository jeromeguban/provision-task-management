import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import type { TaskStatus, TaskPriority } from '@/generated/prisma/client'

async function getAuthUser() {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

async function requireProjectMember(projectId: string, userId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  })
  if (!membership) throw new Error('Not a member of this project')
  return membership
}

function clampIndex(index: number, max: number) {
  return Math.max(0, Math.min(index, max))
}

export const getTasksByProject = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: {
      projectId: string
      status?: TaskStatus
      priority?: TaskPriority
      assigneeId?: string
      search?: string
    }) => data,
  )
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()
    await requireProjectMember(data.projectId, authUser.id)

    const where: any = { projectId: data.projectId }
    if (data.status) where.status = data.status
    if (data.priority) where.priority = data.priority
    if (data.assigneeId) where.assigneeId = data.assigneeId
    if (data.search) {
      where.OR = [
        { title: { contains: data.search, mode: 'insensitive' } },
        { description: { contains: data.search, mode: 'insensitive' } },
      ]
    }

    return prisma.task.findMany({
      where,
      include: {
        creator: true,
        assignee: true,
        _count: { select: { comments: true } },
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    })
  })

export const getTask = createServerFn({ method: 'GET' })
  .inputValidator((data: { taskId: string }) => data)
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()

    const task = await prisma.task.findUniqueOrThrow({
      where: { id: data.taskId },
      include: {
        creator: true,
        assignee: true,
        project: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    await requireProjectMember(task.projectId, authUser.id)
    return task
  })

export const createTask = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      projectId: string
      title: string
      description?: string
      status?: TaskStatus
      priority?: TaskPriority
      dueDate?: string
      assigneeId?: string
    }) => data,
  )
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()
    await requireProjectMember(data.projectId, authUser.id)

    // Get the max position for the status column
    const maxPosition = await prisma.task.aggregate({
      where: { projectId: data.projectId, status: data.status ?? 'TODO' },
      _max: { position: true },
    })

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        status: data.status ?? 'TODO',
        priority: data.priority ?? 'NONE',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        position: (maxPosition._max.position ?? -1) + 1,
        projectId: data.projectId,
        creatorId: authUser.id,
        assigneeId: data.assigneeId ?? null,
      },
      include: { creator: true, assignee: true },
    })
  })

export const updateTask = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      taskId: string
      title?: string
      description?: string
      status?: TaskStatus
      priority?: TaskPriority
      dueDate?: string | null
      assigneeId?: string | null
    }) => data,
  )
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: data.taskId },
    })
    await requireProjectMember(task.projectId, authUser.id)

    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) {
      updateData.status = data.status

      if (data.status !== task.status) {
        const maxPosition = await prisma.task.aggregate({
          where: { projectId: task.projectId, status: data.status },
          _max: { position: true },
        })

        updateData.position = (maxPosition._max.position ?? -1) + 1
      }
    }
    if (data.priority !== undefined) updateData.priority = data.priority
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null
    }
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId

    return prisma.task.update({
      where: { id: data.taskId },
      data: updateData,
      include: { creator: true, assignee: true },
    })
  })

export const moveTask = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      taskId: string
      targetStatus: TaskStatus
      targetIndex: number
    }) => data,
  )
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: data.taskId },
    })
    await requireProjectMember(task.projectId, authUser.id)

    return prisma.$transaction(async (tx) => {
      const currentTask = await tx.task.findUniqueOrThrow({
        where: { id: data.taskId },
      })

      const sourceTasks = await tx.task.findMany({
        where: { projectId: currentTask.projectId, status: currentTask.status },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      })

      const sourceWithoutCurrent = sourceTasks.filter((sourceTask) => sourceTask.id !== currentTask.id)

      if (currentTask.status === data.targetStatus) {
        const nextIndex = clampIndex(data.targetIndex, sourceWithoutCurrent.length)
        const reorderedTasks = [
          ...sourceWithoutCurrent.slice(0, nextIndex),
          currentTask,
          ...sourceWithoutCurrent.slice(nextIndex),
        ]

        await Promise.all(
          reorderedTasks.map((reorderedTask, index) =>
            tx.task.update({
              where: { id: reorderedTask.id },
              data: { position: index },
            }),
          ),
        )
      } else {
        const targetTasks = await tx.task.findMany({
          where: { projectId: currentTask.projectId, status: data.targetStatus },
          orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        })

        const nextIndex = clampIndex(data.targetIndex, targetTasks.length)
        const reorderedTargetTasks = [
          ...targetTasks.slice(0, nextIndex),
          currentTask,
          ...targetTasks.slice(nextIndex),
        ]

        await Promise.all([
          ...sourceWithoutCurrent.map((sourceTask, index) =>
            tx.task.update({
              where: { id: sourceTask.id },
              data: { position: index },
            }),
          ),
          ...reorderedTargetTasks.map((targetTask, index) =>
            tx.task.update({
              where: { id: targetTask.id },
              data:
                targetTask.id === currentTask.id
                  ? { status: data.targetStatus, position: index }
                  : { position: index },
            }),
          ),
        ])
      }

      return tx.task.findUniqueOrThrow({
        where: { id: data.taskId },
        include: {
          creator: true,
          assignee: true,
          _count: { select: { comments: true } },
        },
      })
    })
  })

export const deleteTask = createServerFn({ method: 'POST' })
  .inputValidator((data: { taskId: string }) => data)
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: data.taskId },
    })
    await requireProjectMember(task.projectId, authUser.id)

    await prisma.task.delete({ where: { id: data.taskId } })
    return { success: true }
  })

export const addComment = createServerFn({ method: 'POST' })
  .inputValidator((data: { taskId: string; content: string }) => data)
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: data.taskId },
    })
    await requireProjectMember(task.projectId, authUser.id)

    return prisma.taskComment.create({
      data: {
        content: data.content,
        taskId: data.taskId,
        authorId: authUser.id,
      },
      include: { author: true },
    })
  })

export const getProjectMembers = createServerFn({ method: 'GET' })
  .inputValidator((data: { projectId: string }) => data)
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()
    await requireProjectMember(data.projectId, authUser.id)

    return prisma.projectMember.findMany({
      where: { projectId: data.projectId },
      include: { user: true },
    })
  })

export const deleteComment = createServerFn({ method: 'POST' })
  .inputValidator((data: { commentId: string }) => data)
  .handler(async ({ data }) => {
    const authUser = await getAuthUser()

    const comment = await prisma.taskComment.findUniqueOrThrow({
      where: { id: data.commentId },
    })

    if (comment.authorId !== authUser.id) throw new Error('Not authorized to delete this comment')

    await prisma.taskComment.delete({ where: { id: data.commentId } })
    return { success: true }
  })
