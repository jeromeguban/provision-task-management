import { n as createServerFn } from "../server.js";
import { t as createSsrRpc } from "./createSsrRpc-B5IzqKk_.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/server/dashboard.ts
var getDashboardStats = createServerFn({ method: "GET" }).handler(createSsrRpc("d2a532663c89b9c60f7f8fd65bef42bbd4459841f668dd3a041cedd2c1e087cb"));
//#endregion
//#region src/routes/_authed/dashboard.tsx
var $$splitComponentImporter = () => import("./dashboard-DR2eoMD3.js");
var Route = createFileRoute("/_authed/dashboard")({
	loader: () => getDashboardStats(),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
