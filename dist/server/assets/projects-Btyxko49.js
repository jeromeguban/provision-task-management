import { n as createServerFn } from "../server.js";
import { t as createSsrRpc } from "./createSsrRpc-B5IzqKk_.js";
//#region src/server/projects.ts
var getUserProjects = createServerFn({ method: "GET" }).handler(createSsrRpc("6dade6aad0b83e32273dedb240c63f5169649c74ce4f50dfee7cd28af6d1d4db"));
var getProject = createServerFn({ method: "GET" }).inputValidator((data) => data).handler(createSsrRpc("0ef74326a5824c919c0259568e0bd5aa072fcba8ef27f40999ce5806d6baf0d1"));
var createProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("5c086309e3adf1cf08705ff24355fff50f75d23ae63e4c2852d7ae44b3405e8a"));
var updateProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("90f66bf88a90f89728e9ca4216b40dc46468bfded426015eb9bf626a9bc79690"));
var deleteProject = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("ac9aa40c7a11203f7df71da777fdcfc5fb81276636a3c9f904c150c900958276"));
var addProjectMember = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("c7d7d9a5769882a61f0bbd0c19a38cc7056f029bd07b19b4c92f332f6446a1e8"));
var removeProjectMember = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("75104de216cf8087e295f8646d9f35b71b76943cbde8473ce83256e2be698721"));
//#endregion
export { getUserProjects as a, getProject as i, createProject as n, removeProjectMember as o, deleteProject as r, updateProject as s, addProjectMember as t };
