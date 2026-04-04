import { n as createServerFn } from "../server.js";
import { t as createSsrRpc } from "./createSsrRpc-B5IzqKk_.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/server/tasks.ts
var getTasksByProject = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(createSsrRpc("d7cfe62b8f99c0291446cd44deb05eb988dd976410e10815adbca16c3f823ebb"));
var getTask = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(createSsrRpc("d5136516627e43f5cf88d87ebdfdcf49a5d21cb2b7292bd9595786d7490eaa5a"));
var createTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("ccd5837fbb55ea5c73a39c5d34dcee939713168018c71faec1288bca5ac16f44"));
var updateTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("9d16584b5d2a23cee36be22db89baf45e323d9328dcf410cf72f84bc38e5d42b"));
var moveTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("e60b994c8dfc1b92a1f345f4c22d06c6a2b2f900f6c8ec2a8cb2fe512cad1b9b"));
var deleteTask = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("a2e0ea788cf5704df6a2eba87ddaa1012617a3df34580ea38433ee253e159865"));
var addComment = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("08563fdc09a8a98b0c3dd40d9972f382481e4a7e2535ac2f7860320d5621c134"));
var getProjectMembers = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(createSsrRpc("331b87b1879c265c2f97a862810042d458c31af1bd32b44e5cb5225a150f864f"));
var deleteComment = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("3e7abccfbcb21fdab1dca6fa4d16067811dc384e13886d036db4185cfb651448"));
//#endregion
//#region src/routes/_authed/projects.$projectId.index.tsx
var $$splitComponentImporter = () => import("./projects._projectId.index-DPoZ4Vl8.js");
var Route = createFileRoute("/_authed/projects/$projectId/")({
	loader: ({ params }) => getTasksByProject({ data: { projectId: params.projectId } }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { deleteTask as a, getTasksByProject as c, deleteComment as i, moveTask as l, addComment as n, getProjectMembers as o, createTask as r, getTask as s, Route as t, updateTask as u };
