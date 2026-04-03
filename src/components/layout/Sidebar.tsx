import { Link, useParams } from "@tanstack/react-router";
import {
  CheckSquare,
  LayoutDashboard,
  FolderKanban,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getUserProjects } from "@/server/projects";
import type { Project } from "@/generated/prisma/client";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [projects, setProjects] = useState<
    (Project & { _count: { tasks: number } })[]
  >([]);
  const params = useParams({ strict: false }) as { projectId?: string };

  useEffect(() => {
    getUserProjects()
      .then(setProjects)
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-overlay-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 provisioners-glass border-r border-border flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_100%)] text-white shadow-[0_18px_34px_rgba(168,85,247,0.24)]">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-text-tertiary">
                Workspace
              </p>
              <span className="text-base font-semibold text-text-primary">
                ProVisioners
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-surface-tertiary text-text-tertiary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors [&.active]:bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))] [&.active]:text-primary-700 [&.active]:shadow-sm"
            onClick={onClose}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            to="/projects"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors [&.active]:bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))] [&.active]:text-primary-700 [&.active]:shadow-sm"
            onClick={onClose}
          >
            <FolderKanban className="h-4 w-4" />
            All Projects
          </Link>

          {/* Projects section */}
          <div className="pt-4">
            <div className="flex items-center justify-between px-3.5 mb-2">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Projects
              </span>
              <Link
                to="/projects/new"
                className="p-1 rounded hover:bg-surface-tertiary text-text-tertiary hover:text-text-primary transition-colors"
                onClick={onClose}
              >
                <Plus className="h-3.5 w-3.5" />
              </Link>
            </div>

            {projects.length === 0 ? (
              <p className="px-3.5 py-2 text-xs text-text-tertiary">
                No projects yet
              </p>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  to="/projects/$projectId"
                  params={{ projectId: project.id }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors ${
                    params.projectId === project.id
                      ? "bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))] text-primary-700 shadow-sm"
                      : ""
                  }`}
                  onClick={onClose}
                >
                  <div
                    className="h-3 w-3 rounded-sm shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="truncate">{project.name}</span>
                  <span className="ml-auto text-xs text-text-tertiary">
                    {project._count.tasks}
                  </span>
                </Link>
              ))
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Link
            to="/projects"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
            onClick={onClose}
          >
            <Settings className="h-4 w-4" />
            Manage Projects
          </Link>
        </div>
      </aside>
    </>
  );
}
