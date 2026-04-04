import { t as Route } from "./projects.index-EPiDZF_a.js";
import { t as Card } from "./Card-BjkVra_i.js";
import { t as Badge } from "./Badge-B1X0Y5Ua.js";
import { t as Button } from "./Button-CD5r_r4G.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { FolderKanban, Plus, Users } from "lucide-react";
//#region src/routes/_authed/projects.index.tsx?tsr-split=component
function ProjectsListPage() {
	const projects = Route.useLoaderData();
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-5xl mx-auto space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold text-text-primary",
				children: "Projects"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-text-secondary mt-1",
				children: "Manage and organize your projects"
			})] }), /* @__PURE__ */ jsx(Link, {
				to: "/projects/new",
				children: /* @__PURE__ */ jsxs(Button, { children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "New Project"] })
			})]
		}), projects.length === 0 ? /* @__PURE__ */ jsxs(Card, {
			className: "text-center py-12",
			children: [
				/* @__PURE__ */ jsx(FolderKanban, { className: "h-12 w-12 text-text-tertiary mx-auto mb-4" }),
				/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-semibold text-text-primary mb-2",
					children: "No projects yet"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-text-secondary mb-6",
					children: "Create your first project to start managing tasks"
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/projects/new",
					children: /* @__PURE__ */ jsxs(Button, { children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "Create Project"] })
				})
			]
		}) : /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
			children: projects.map((project) => /* @__PURE__ */ jsx(Link, {
				to: "/projects/$projectId",
				params: { projectId: project.id },
				className: "block group",
				children: /* @__PURE__ */ jsxs(Card, {
					className: "hover:border-primary-300 hover:shadow-[0_22px_46px_rgba(168,85,247,0.14)] transition-all h-full",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "h-10 w-10 rounded-lg shrink-0 flex items-center justify-center",
							style: { backgroundColor: project.color + "20" },
							children: /* @__PURE__ */ jsx(FolderKanban, {
								className: "h-5 w-5",
								style: { color: project.color }
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-semibold text-text-primary group-hover:text-primary-600 transition-colors truncate",
								children: project.name
							}), project.description && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-text-secondary mt-1 line-clamp-2",
								children: project.description
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 mt-4 pt-4 border-t border-border",
						children: [/* @__PURE__ */ jsxs(Badge, {
							variant: "primary",
							children: [project._count.tasks, " tasks"]
						}), /* @__PURE__ */ jsxs(Badge, {
							variant: "default",
							children: [/* @__PURE__ */ jsx(Users, { className: "h-3 w-3 mr-1" }), project.role]
						})]
					})]
				})
			}, project.id))
		})]
	});
}
//#endregion
export { ProjectsListPage as component };
