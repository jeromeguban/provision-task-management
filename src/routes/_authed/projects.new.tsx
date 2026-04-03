import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { createProject } from '@/server/projects'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/projects/new')({
  component: NewProjectPage,
})

const PROJECT_COLORS = [
  '#7c3aed',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#6366f1',
]

function NewProjectPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#7c3aed')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const project = await createProject({ data: { name, description, color } })
      navigate({ to: '/projects/$projectId', params: { projectId: project.id } })
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/projects" className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">New Project</h1>
          <p className="text-text-secondary mt-1">Set up a new project for your team</p>
        </div>
      </div>

      <Card className="bg-[linear-gradient(180deg,rgba(124,58,237,0.06),rgba(255,255,255,0.82)_34%)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Website Redesign"
            required
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1.5">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this project about?"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface text-text-primary placeholder:text-text-tertiary resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Project color
            </label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    color === c ? 'border-text-primary scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
            <Link to="/projects">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
