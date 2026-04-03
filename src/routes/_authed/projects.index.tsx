import { createFileRoute, Link } from '@tanstack/react-router'
import { getUserProjects } from '@/server/projects'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, FolderKanban, Users } from 'lucide-react'

export const Route = createFileRoute('/_authed/projects/')({
  loader: () => getUserProjects(),
  component: ProjectsListPage,
})

function ProjectsListPage() {
  const projects = Route.useLoaderData()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-secondary mt-1">Manage and organize your projects</p>
        </div>
        <Link to="/projects/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <FolderKanban className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">No projects yet</h2>
          <p className="text-text-secondary mb-6">Create your first project to start managing tasks</p>
          <Link to="/projects/new">
            <Button>
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className="block group"
            >
              <Card className="hover:border-primary-300 hover:shadow-[0_22px_46px_rgba(168,85,247,0.14)] transition-all h-full">
                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: project.color + '20' }}
                  >
                    <FolderKanban className="h-5 w-5" style={{ color: project.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-text-primary group-hover:text-primary-600 transition-colors truncate">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                  <Badge variant="primary">{project._count.tasks} tasks</Badge>
                  <Badge variant="default">
                    <Users className="h-3 w-3 mr-1" />
                    {project.role}
                  </Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
