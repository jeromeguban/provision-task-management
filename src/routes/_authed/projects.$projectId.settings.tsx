import { createFileRoute, getRouteApi, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProject,
} from '@/server/projects'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Trash2, UserPlus, X } from 'lucide-react'

export const Route = createFileRoute('/_authed/projects/$projectId/settings')({
  component: ProjectSettingsPage,
})

const projectRouteApi = getRouteApi('/_authed/projects/$projectId')

const PROJECT_COLORS = [
  '#7c3aed', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#10b981', '#14b8a6',
  '#06b6d4', '#6366f1',
]

function ProjectSettingsPage() {
  const navigate = useNavigate()
  const project = projectRouteApi.useLoaderData()
  const { projectId } = Route.useParams()
  const [projectData, setProjectData] = useState(project)
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description ?? '')
  const [color, setColor] = useState(project.color)
  const [loading, setLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteLoading, setInviteLoading] = useState(false)

  const isOwnerOrAdmin = ['OWNER', 'ADMIN'].includes(projectData.currentUserRole)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const updatedProject = await updateProject({ data: { projectId, name, description, color } })
    setProjectData((currentProject) => ({
      ...currentProject,
      ...updatedProject,
    }))
    setLoading(false)
    navigate({ to: '/projects/$projectId', params: { projectId }, replace: true })
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return
    await deleteProject({ data: { projectId } })
    navigate({ to: '/projects' })
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError(null)
    setInviteLoading(true)
    const result = await addProjectMember({ data: { projectId, email: inviteEmail } })
    if (result.error) {
      setInviteError(result.error)
    } else {
      setInviteEmail('')
      const data = await getProject({ data: { projectId } })
      setProjectData(data)
    }
    setInviteLoading(false)
  }

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm('Remove this member from the project?')) return
    await removeProjectMember({ data: { projectId, userId } })
    const data = await getProject({ data: { projectId } })
    setProjectData(data)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Project details */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Project Details</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            id="name"
            label="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isOwnerOrAdmin}
            required
          />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isOwnerOrAdmin}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface text-text-primary placeholder:text-text-tertiary resize-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => isOwnerOrAdmin && setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    color === c ? 'border-text-primary scale-110' : 'border-transparent'
                  } ${!isOwnerOrAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          {isOwnerOrAdmin && (
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </form>
      </Card>

      {/* Members */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Members</h2>

        {isOwnerOrAdmin && (
          <form onSubmit={handleInvite} className="flex gap-2 mb-4">
            <div className="flex-1">
              <Input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email to invite"
                type="email"
                error={inviteError ?? undefined}
                required
              />
            </div>
            <Button type="submit" disabled={inviteLoading} className="shrink-0">
              <UserPlus className="h-4 w-4" />
              {inviteLoading ? 'Inviting...' : 'Invite'}
            </Button>
          </form>
        )}

        <div className="divide-y divide-border">
          {projectData.members.map((member: any) => (
            <div key={member.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Avatar name={member.user.fullName} src={member.user.avatarUrl} size="sm" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {member.user.fullName || member.user.email}
                  </p>
                  <p className="text-xs text-text-tertiary">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={member.role === 'OWNER' ? 'primary' : member.role === 'ADMIN' ? 'info' : 'default'}
                >
                  {member.role}
                </Badge>
                {isOwnerOrAdmin && member.role !== 'OWNER' && (
                  <button
                    onClick={() => handleRemoveMember(member.userId)}
                    className="p-1 rounded hover:bg-rose-50 text-text-tertiary hover:text-rose-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      {projectData.currentUserRole === 'OWNER' && (
        <Card className="border-rose-200">
          <h2 className="text-lg font-semibold text-rose-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-text-secondary mb-4">
            Deleting this project will permanently remove all tasks and data.
          </p>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            Delete Project
          </Button>
        </Card>
      )}
    </div>
  )
}
