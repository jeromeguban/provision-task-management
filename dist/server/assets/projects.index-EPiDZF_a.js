import { a as getUserProjects } from "./projects-Btyxko49.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_authed/projects.index.tsx
var $$splitComponentImporter = () => import("./projects.index-bwqwo7K1.js");
var Route = createFileRoute("/_authed/projects/")({
	loader: () => getUserProjects(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
