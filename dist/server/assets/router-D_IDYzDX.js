import { t as fetchUser } from "./auth-BPjSQTJx.js";
import { t as Route$7 } from "./dashboard-BdfqRl_X.js";
import { t as Route$8 } from "./projects.index-EPiDZF_a.js";
import { t as Route$9 } from "./projects._projectId-A_wuQIOD.js";
import { t as Route$10 } from "./projects._projectId.index-BP0NbEQz.js";
import { t as Route$11 } from "./projects._projectId.settings-Cfoy30Pf.js";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter as createRouter$1, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/styles/app.css?url
var app_default = "/assets/app-D-XJ29Q3.css";
//#endregion
//#region src/routes/__root.tsx
var Route$6 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ProVisioners TaskFlow " }
		],
		links: [
			{
				rel: "stylesheet",
				href: app_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			}
		]
	}),
	beforeLoad: async () => {
		let user = null;
		try {
			user = await fetchUser();
		} catch (error) {
			console.error("Root beforeLoad failed to fetch user", error);
		}
		return { user };
	},
	component: RootComponent,
	notFoundComponent: NotFoundComponent
});
function RootComponent() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [/* @__PURE__ */ jsx(HeadContent, {}), /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()` } })] }), /* @__PURE__ */ jsxs("body", { children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [/* @__PURE__ */ jsxs("main", {
			className: "flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-slate-100",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-sm uppercase tracking-[0.3em] text-slate-400",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-3xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "max-w-md text-sm text-slate-300",
					children: "The page you requested does not exist or is no longer available."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "rounded-full bg-cyan-400 px-5 py-2 text-sm font-medium text-slate-950",
						children: "Go home"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/login",
						className: "rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-100",
						children: "Log in"
					})]
				})
			]
		}), /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
//#endregion
//#region src/routes/signup.tsx
var $$splitComponentImporter$4 = () => import("./signup-KCyin3XG.js");
var Route$5 = createFileRoute("/signup")({
	beforeLoad: ({ context }) => {
		if (context.user) throw redirect({ to: "/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/login.tsx
var $$splitComponentImporter$3 = () => import("./login-Rou5AlX1.js");
var Route$4 = createFileRoute("/login")({
	beforeLoad: ({ context }) => {
		if (context.user) throw redirect({ to: "/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/_authed.tsx
var $$splitComponentImporter$2 = () => import("./_authed-DHhjOH-6.js");
var Route$3 = createFileRoute("/_authed")({
	beforeLoad: ({ context }) => {
		if (!context.user) throw redirect({ to: "/login" });
		return { user: context.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/index.tsx
var Route$2 = createFileRoute("/")({ beforeLoad: ({ context }) => {
	if (context.user) throw redirect({ to: "/dashboard" });
	throw redirect({ to: "/login" });
} });
//#endregion
//#region src/routes/_authed/projects.tsx
var $$splitComponentImporter$1 = () => import("./projects-DXevPOqv.js");
var Route$1 = createFileRoute("/_authed/projects")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
//#endregion
//#region src/routes/_authed/projects.new.tsx
var $$splitComponentImporter = () => import("./projects.new-B_C1MQtx.js");
var Route = createFileRoute("/_authed/projects/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var SignupRoute = Route$5.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$6
});
var LoginRoute = Route$4.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$6
});
var AuthedRoute = Route$3.update({
	id: "/_authed",
	getParentRoute: () => Route$6
});
var IndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var AuthedProjectsRoute = Route$1.update({
	id: "/projects",
	path: "/projects",
	getParentRoute: () => AuthedRoute
});
var AuthedDashboardRoute = Route$7.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthedRoute
});
var AuthedProjectsIndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthedProjectsRoute
});
var AuthedProjectsNewRoute = Route.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AuthedProjectsRoute
});
var AuthedProjectsProjectIdRoute = Route$9.update({
	id: "/$projectId",
	path: "/$projectId",
	getParentRoute: () => AuthedProjectsRoute
});
var AuthedProjectsProjectIdIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthedProjectsProjectIdRoute
});
var AuthedProjectsProjectIdRouteChildren = {
	AuthedProjectsProjectIdSettingsRoute: Route$11.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => AuthedProjectsProjectIdRoute
	}),
	AuthedProjectsProjectIdIndexRoute
};
var AuthedProjectsRouteChildren = {
	AuthedProjectsProjectIdRoute: AuthedProjectsProjectIdRoute._addFileChildren(AuthedProjectsProjectIdRouteChildren),
	AuthedProjectsNewRoute,
	AuthedProjectsIndexRoute
};
var AuthedRouteChildren = {
	AuthedDashboardRoute,
	AuthedProjectsRoute: AuthedProjectsRoute._addFileChildren(AuthedProjectsRouteChildren)
};
var rootRouteChildren = {
	IndexRoute,
	AuthedRoute: AuthedRoute._addFileChildren(AuthedRouteChildren),
	LoginRoute,
	SignupRoute
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var router;
function createRouter() {
	return createRouter$1({
		routeTree,
		context: { user: null },
		scrollRestoration: true,
		defaultPreload: "intent"
	});
}
function getRouter() {
	if (!router) router = createRouter();
	return router;
}
//#endregion
export { createRouter, getRouter };
