//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({
	"routes": {
		"__root__": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/__root.tsx",
			"children": [
				"/",
				"/_authed",
				"/login",
				"/signup"
			],
			"preloads": [
				"/assets/main-Bk3JgJHV.js",
				"/assets/useStore-xi_kMsXR.js",
				"/assets/preload-helper-DvEyNg7S.js",
				"/assets/createServerFn-CTR4tqWg.js",
				"/assets/matchContext-CZUMC7I3.js",
				"/assets/projects-_-0UpTHy.js"
			]
		},
		"/_authed": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/_authed.tsx",
			"children": ["/_authed/dashboard", "/_authed/projects"],
			"preloads": [
				"/assets/_authed-BEwD_bdF.js",
				"/assets/useRouteContext-DcrimL6i.js",
				"/assets/createLucideIcon-D0CyOpSH.js",
				"/assets/folder-kanban-BKamcHcK.js",
				"/assets/plus-so64-MhT.js",
				"/assets/settings-DwctM8yY.js",
				"/assets/square-check-big-CXunDqhx.js",
				"/assets/Avatar-DI7FGIPT.js"
			]
		},
		"/login": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/login.tsx",
			"preloads": [
				"/assets/login-uJ7LgIuL.js",
				"/assets/createLucideIcon-D0CyOpSH.js",
				"/assets/mail-BasF1LIG.js",
				"/assets/square-check-big-CXunDqhx.js"
			]
		},
		"/signup": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/signup.tsx",
			"preloads": [
				"/assets/signup-B8zoV5DT.js",
				"/assets/createLucideIcon-D0CyOpSH.js",
				"/assets/mail-BasF1LIG.js",
				"/assets/square-check-big-CXunDqhx.js",
				"/assets/user-plus-CFTkDAnG.js"
			]
		},
		"/_authed/dashboard": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/_authed/dashboard.tsx",
			"preloads": [
				"/assets/dashboard-DBmmyigy.js",
				"/assets/list-todo-BQ8JohuW.js",
				"/assets/Badge-6gt7blb2.js",
				"/assets/Card-BFvb4tIG.js"
			]
		},
		"/_authed/projects": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/_authed/projects.tsx",
			"children": [
				"/_authed/projects/$projectId",
				"/_authed/projects/new",
				"/_authed/projects/"
			],
			"preloads": ["/assets/projects-Bw9VwuqT.js"]
		},
		"/_authed/projects/$projectId": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/_authed/projects.$projectId.tsx",
			"children": ["/_authed/projects/$projectId/settings", "/_authed/projects/$projectId/"],
			"preloads": ["/assets/projects._projectId-BwaSwzcX.js"]
		},
		"/_authed/projects/new": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/_authed/projects.new.tsx",
			"preloads": [
				"/assets/projects.new-r4u9pdDY.js",
				"/assets/Button-Bh2HV8Rf.js",
				"/assets/Card-BFvb4tIG.js",
				"/assets/Input-CA8Mex05.js"
			]
		},
		"/_authed/projects/": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/_authed/projects.index.tsx",
			"preloads": [
				"/assets/projects.index-By95l301.js",
				"/assets/Badge-6gt7blb2.js",
				"/assets/Button-Bh2HV8Rf.js",
				"/assets/Card-BFvb4tIG.js"
			]
		},
		"/_authed/projects/$projectId/settings": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/_authed/projects.$projectId.settings.tsx",
			"preloads": [
				"/assets/projects._projectId.settings-C7HvT3rk.js",
				"/assets/trash-2-BqyWvAL0.js",
				"/assets/user-plus-CFTkDAnG.js",
				"/assets/Badge-6gt7blb2.js",
				"/assets/Button-Bh2HV8Rf.js",
				"/assets/Card-BFvb4tIG.js",
				"/assets/Input-CA8Mex05.js"
			]
		},
		"/_authed/projects/$projectId/": {
			"filePath": "C:/laragon/www/portfolio/provision-task-management/src/routes/_authed/projects.$projectId.index.tsx",
			"preloads": [
				"/assets/projects._projectId.index-DlmToPgm.js",
				"/assets/list-todo-BQ8JohuW.js",
				"/assets/trash-2-BqyWvAL0.js",
				"/assets/Badge-6gt7blb2.js",
				"/assets/Button-Bh2HV8Rf.js",
				"/assets/Card-BFvb4tIG.js"
			]
		}
	},
	"clientEntry": "/assets/main-Bk3JgJHV.js"
});
//#endregion
export { tsrStartManifest };
