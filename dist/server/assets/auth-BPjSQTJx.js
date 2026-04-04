import { n as createServerFn } from "../server.js";
import { t as createSsrRpc } from "./createSsrRpc-B5IzqKk_.js";
//#region src/server/auth.ts
var fetchUser = createServerFn({ method: "GET" }).handler(createSsrRpc("6cd936469cf814c93bf346ff77d834fb61778d94cdbb977d7051b01bbb296fa0"));
var loginFn = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("1bd5f6beef8b8498f487d444b475ec43c130b872d5482a076588f45d1d824033"));
var signupFn = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("cd37bf5b44ea2939a1d7c86d72030ae9c23710e31e36522287ad7f6d0c0f944c"));
var logoutFn = createServerFn({ method: "POST" }).handler(createSsrRpc("9ba0115062514df0860765457c03095b2fb0bdf04c256d5c5cd841a19dca77fa"));
//#endregion
export { signupFn as i, loginFn as n, logoutFn as r, fetchUser as t };
