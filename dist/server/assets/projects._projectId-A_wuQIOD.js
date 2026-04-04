import { i as getProject } from "./projects-Btyxko49.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_authed/projects.$projectId.tsx
var $$splitComponentImporter = () => import("./projects._projectId-yVAtyXrq.js");
var Route = createFileRoute("/_authed/projects/$projectId")({
	loader: ({ params }) => getProject({ data: { projectId: params.projectId } }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
