import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export const getDashboardStats = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const memberProjects = await prisma.projectMember.findMany({
    where: { userId: user.id },
    select: { projectId: true },
  })
  const projectIds = memberProjects.map((m) => m.projectId)

  const [totalTasks, completedTasks, overdueTasks, recentTasks, dueSoonTasks] =
    await Promise.all([
      prisma.task.count({
        where: { projectId: { in: projectIds } },
      }),
      prisma.task.count({
        where: { projectId: { in: projectIds }, status: 'DONE' },
      }),
      prisma.task.count({
        where: {
          projectId: { in: projectIds },
          status: { notIn: ['DONE', 'CANCELLED'] },
          dueDate: { lt: new Date() },
        },
      }),
      prisma.task.findMany({
        where: { projectId: { in: projectIds } },
        include: { project: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
      prisma.task.findMany({
        where: {
          projectId: { in: projectIds },
          status: { notIn: ['DONE', 'CANCELLED'] },
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
        include: { project: { select: { name: true } } },
        orderBy: { dueDate: 'asc' },
        take: 8,
      }),
    ])

  return {
    totalProjects: projectIds.length,
    totalTasks,
    completedTasks,
    overdueTasks,
    recentTasks,
    dueSoonTasks,
  }
})
