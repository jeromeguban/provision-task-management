import { createFileRoute, Outlet, Link, useNavigate } from '@tanstack/react-router'
import { getProject } from '@/server/projects'
import { LayoutList, Columns3, Settings, ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/_authed/projects/$projectId')({
  loader: ({ params }) => getProject({ data: { projectId: params.projectId } }),
  component: ProjectLayout,
})

function ProjectLayout() {
  const project = Route.useLoaderData()

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Project header */}
      <div className="provisioners-glass flex items-center justify-between rounded-[24px] px-5 py-4">
        <div className="flex items-center gap-3">
          <Link to="/projects" className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-secondary">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div
            className="h-8 w-8 rounded-lg"
            style={{ backgroundColor: project.color }}
          />
          <div>
            <h1 className="text-xl font-bold text-text-primary">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-text-secondary">{project.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-surface/70 border border-border rounded-2xl p-1">
          <Link
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            activeOptions={{ exact: true }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl text-text-secondary hover:text-text-primary transition-colors [&.active]:bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))] [&.active]:text-primary-700 [&.active]:font-medium"
          >
            <Columns3 className="h-4 w-4" />
            Board
          </Link>
          <Link
            to="/projects/$projectId/settings"
            params={{ projectId: project.id }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl text-text-secondary hover:text-text-primary transition-colors [&.active]:bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))] [&.active]:text-primary-700 [&.active]:font-medium"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>

      <Outlet />
    </div>
  )
}
