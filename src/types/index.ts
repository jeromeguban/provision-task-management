import type { User, Project, ProjectMember, Task, TaskComment } from '@/generated/prisma/client'

export type { User, Project, ProjectMember, Task, TaskComment }

export type TaskCommentWithAuthor = TaskComment & {
  author: User
}

export type ProjectWithMembers = Project & {
  members: (ProjectMember & { user: User })[]
  _count?: { tasks: number }
}

export type TaskWithRelations = Task & {
  creator: User
  assignee: User | null
  project?: Project
  comments?: TaskCommentWithAuthor[]
  _count?: { comments: number }
}

export type ProjectMemberWithUser = ProjectMember & {
  user: User
}
