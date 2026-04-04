import { n as createProject } from "./projects-Btyxko49.js";
import { t as Card } from "./Card-BjkVra_i.js";
import { t as Button } from "./Button-CD5r_r4G.js";
import { t as Input } from "./Input-Bpsm-2zk.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft } from "lucide-react";
//#region src/routes/_authed/projects.new.tsx?tsr-split=component
var PROJECT_COLORS = [
	"#7c3aed",
	"#8b5cf6",
	"#ec4899",
	"#f43f5e",
	"#f97316",
	"#eab308",
	"#10b981",
	"#14b8a6",
	"#06b6d4",
	"#6366f1"
];
function NewProjectPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState("#7c3aed");
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			navigate({
				to: "/projects/$projectId",
				params: { projectId: (await createProject({ data: {
					name,
					description,
					color
				} })).id }
			});
		} catch {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "max-w-xl mx-auto space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ jsx(Link, {
				to: "/projects",
				className: "p-1.5 rounded-lg hover:bg-surface-tertiary text-text-secondary",
				children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-5 w-5" })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold text-text-primary",
				children: "New Project"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-text-secondary mt-1",
				children: "Set up a new project for your team"
			})] })]
		}), /* @__PURE__ */ jsx(Card, {
			className: "bg-[linear-gradient(180deg,rgba(124,58,237,0.06),rgba(255,255,255,0.82)_34%)]",
			children: /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ jsx(Input, {
						id: "name",
						label: "Project name",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "e.g., Website Redesign",
						required: true
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "description",
						className: "block text-sm font-medium text-text-secondary mb-1.5",
						children: "Description (optional)"
					}), /* @__PURE__ */ jsx("textarea", {
						id: "description",
						value: description,
						onChange: (e) => setDescription(e.target.value),
						placeholder: "What's this project about?",
						rows: 3,
						className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface text-text-primary placeholder:text-text-tertiary resize-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-text-secondary mb-2",
						children: "Project color"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-2",
						children: PROJECT_COLORS.map((c) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setColor(c),
							className: `h-8 w-8 rounded-full border-2 transition-all ${color === c ? "border-text-primary scale-110" : "border-transparent"}`,
							style: { backgroundColor: c }
						}, c))
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 pt-2",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: loading || !name.trim(),
							children: loading ? "Creating..." : "Create Project"
						}), /* @__PURE__ */ jsx(Link, {
							to: "/projects",
							children: /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								children: "Cancel"
							})
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { NewProjectPage as component };
