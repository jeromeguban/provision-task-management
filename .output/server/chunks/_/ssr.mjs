import { mergeHeaders, json } from '@tanstack/router-core/ssr/client';
import { isPlainObject, isRedirect, isNotFound, joinPaths, trimPath, processRouteTree, isResolvedRedirect, rootRouteId, getMatchedRoutes } from '@tanstack/router-core';
import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { AsyncLocalStorage } from 'node:async_hooks';
import { createServerClient } from '@supabase/ssr';
import { setCookie, parseCookies } from 'vinxi/http';
import { PrismaClient, ProjectRole } from '@prisma/client';
import { jsx, jsxs } from 'react/jsx-runtime';
import { createFileRoute, lazyRouteComponent, createRootRouteWithContext, HeadContent, Outlet, Scripts, redirect, RouterProvider, createRouter } from '@tanstack/react-router';
import { defineHandlerCallback, renderRouterToStream } from '@tanstack/react-router/ssr/server';
import { createMemoryHistory } from '@tanstack/history';
import { attachRouterServerSsrUtils } from '@tanstack/router-core/ssr/server';

var startSerializer = {
  stringify: (value) => JSON.stringify(value, function replacer(key, val) {
    const ogVal = this[key];
    const serializer = serializers.find((t) => t.stringifyCondition(ogVal));
    if (serializer) return serializer.stringify(ogVal);
    return val;
  }),
  parse: (value) => JSON.parse(value, function parser(key, val) {
    const ogVal = this[key];
    if (isPlainObject(ogVal)) {
      const serializer = serializers.find((t) => t.parseCondition(ogVal));
      if (serializer) return serializer.parse(ogVal);
    }
    return val;
  }),
  encode: (value) => {
    if (Array.isArray(value)) return value.map((v) => startSerializer.encode(v));
    if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, startSerializer.encode(v)]));
    const serializer = serializers.find((t) => t.stringifyCondition(value));
    if (serializer) return serializer.stringify(value);
    return value;
  },
  decode: (value) => {
    if (isPlainObject(value)) {
      const serializer = serializers.find((t) => t.parseCondition(value));
      if (serializer) return serializer.parse(value);
    }
    if (Array.isArray(value)) return value.map((v) => startSerializer.decode(v));
    if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, startSerializer.decode(v)]));
    return value;
  }
};
var createSerializer = (key, check, toValue, fromValue) => ({
  key,
  stringifyCondition: check,
  stringify: (value) => ({ [`$${key}`]: toValue(value) }),
  parseCondition: (value) => Object.hasOwn(value, `$${key}`),
  parse: (value) => fromValue(value[`$${key}`])
});
var serializers = [
  createSerializer("undefined", (v) => v === void 0, () => 0, () => void 0),
  createSerializer("date", (v) => v instanceof Date, (v) => v.toISOString(), (v) => new Date(v)),
  createSerializer("error", (v) => v instanceof Error, (v) => ({
    ...v,
    message: v.message,
    stack: void 0,
    cause: v.cause
  }), (v) => Object.assign(new Error(v.message), v)),
  createSerializer("formData", (v) => v instanceof FormData, (v) => {
    const entries = {};
    v.forEach((value, key) => {
      const entry = entries[key];
      if (entry !== void 0) if (Array.isArray(entry)) entry.push(value);
      else entries[key] = [entry, value];
      else entries[key] = value;
    });
    return entries;
  }, (v) => {
    const formData = new FormData();
    Object.entries(v).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach((val) => formData.append(key, val));
      else formData.append(key, value);
    });
    return formData;
  }),
  createSerializer("bigint", (v) => typeof v === "bigint", (v) => v.toString(), (v) => BigInt(v)),
  createSerializer("server-function", (v) => typeof v === "function" && "functionId" in v && typeof v.functionId === "string", ({ functionId }) => ({
    functionId,
    __serverFn: true
  }), (v) => v)
];
var startStorage = new AsyncLocalStorage();
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && (opts == null ? void 0 : opts.throwIfNotFound) !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return context;
}
var globalMiddleware = [];
var getRouterInstance = () => {
  var _a;
  return (_a = getStartContext({ throwIfNotFound: false })) == null ? void 0 : _a.router;
};
function createServerFn(options, __opts) {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, { middleware }));
    },
    validator: (validator) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, { validator }));
    },
    type: (type) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, { type }));
    },
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      Object.assign(resolvedOptions, {
        ...extractedFn,
        extractedFn,
        serverFn
      });
      const resolvedMiddleware = [...resolvedOptions.middleware || [], serverFnBaseToMiddleware(resolvedOptions)];
      return Object.assign(async (opts) => {
        return executeMiddleware$1(resolvedMiddleware, "client", {
          ...extractedFn,
          ...resolvedOptions,
          data: opts == null ? void 0 : opts.data,
          headers: opts == null ? void 0 : opts.headers,
          signal: opts == null ? void 0 : opts.signal,
          context: {},
          router: getRouterInstance()
        }).then((d) => {
          if (resolvedOptions.response === "full") return d;
          if (d.error) throw d.error;
          return d.result;
        });
      }, {
        ...extractedFn,
        __executeServer: async (opts_, signal) => {
          const opts = opts_ instanceof FormData ? extractFormDataContext(opts_) : opts_;
          opts.type = typeof resolvedOptions.type === "function" ? resolvedOptions.type(opts) : resolvedOptions.type;
          const ctx = {
            ...extractedFn,
            ...opts,
            signal
          };
          const run = () => executeMiddleware$1(resolvedMiddleware, "server", ctx).then((d) => ({
            result: d.result,
            error: d.error,
            context: d.sendContext
          }));
          if (ctx.type === "static") {
            let response;
            if (serverFnStaticCache == null ? void 0 : serverFnStaticCache.getItem) response = await serverFnStaticCache.getItem(ctx);
            if (!response) {
              response = await run().then((d) => {
                return {
                  ctx: d,
                  error: null
                };
              }).catch((e) => {
                return {
                  ctx: void 0,
                  error: e
                };
              });
              if (serverFnStaticCache == null ? void 0 : serverFnStaticCache.setItem) await serverFnStaticCache.setItem(ctx, response);
            }
            invariant(response, "No response from both server and static cache!");
            if (response.error) throw response.error;
            return response.ctx;
          }
          return run();
        }
      });
    }
  };
}
async function executeMiddleware$1(middlewares, env, opts) {
  const flattenedMiddlewares = flattenMiddlewares([...globalMiddleware, ...middlewares]);
  const next = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) return ctx;
    if (nextMiddleware.options.validator && (env === "client" ? nextMiddleware.options.validateClient : true)) ctx.data = await execValidator(nextMiddleware.options.validator, ctx.data);
    const middlewareFn = env === "client" ? nextMiddleware.options.client : nextMiddleware.options.server;
    if (middlewareFn) return applyMiddleware(middlewareFn, ctx, async (newCtx) => {
      return next(newCtx).catch((error) => {
        if (isRedirect(error) || isNotFound(error)) return {
          ...newCtx,
          error
        };
        throw error;
      });
    });
    return next(ctx);
  };
  return next({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || {}
  });
}
var serverFnStaticCache;
function setServerFnStaticCache(cache) {
  const previousCache = serverFnStaticCache;
  serverFnStaticCache = typeof cache === "function" ? cache() : cache;
  return () => {
    serverFnStaticCache = previousCache;
  };
}
function createServerFnStaticCache(serverFnStaticCache2) {
  return serverFnStaticCache2;
}
async function sha1Hash(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
setServerFnStaticCache(() => {
  const getStaticCacheUrl = async (options, hash) => {
    return `/__tsr/staticServerFnCache/${await sha1Hash(`${options.functionId}__${hash}`)}.json`;
  };
  const jsonToFilenameSafeString = (json) => {
    const sortedKeysReplacer = (key, value) => value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value).sort().reduce((acc, curr) => {
      acc[curr] = value[curr];
      return acc;
    }, {}) : value;
    return JSON.stringify(json != null ? json : "", sortedKeysReplacer).replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_");
  };
  const staticClientCache = typeof document !== "undefined" ? /* @__PURE__ */ new Map() : null;
  return createServerFnStaticCache({
    getItem: async (ctx) => {
      if (typeof document === "undefined") {
        const url = await getStaticCacheUrl(ctx, jsonToFilenameSafeString(ctx.data));
        const publicUrl = "C:/laragon/www/portfolio/provisioners-task-flow/.output/public";
        const { promises: fs } = await import('node:fs');
        const filePath = (await import('node:path')).join(publicUrl, url);
        const [cachedResult, readError] = await fs.readFile(filePath, "utf-8").then((c) => [startSerializer.parse(c), null]).catch((e) => [null, e]);
        if (readError && readError.code !== "ENOENT") throw readError;
        return cachedResult;
      }
    },
    setItem: async (ctx, response) => {
      const { promises: fs } = await import('node:fs');
      const path = await import('node:path');
      const url = await getStaticCacheUrl(ctx, jsonToFilenameSafeString(ctx.data));
      const filePath = path.join("C:/laragon/www/portfolio/provisioners-task-flow/.output/public", url);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, startSerializer.stringify(response));
    },
    fetchItem: async (ctx) => {
      const url = await getStaticCacheUrl(ctx, jsonToFilenameSafeString(ctx.data));
      let result = staticClientCache == null ? void 0 : staticClientCache.get(url);
      if (!result) {
        result = await fetch(url, { method: "GET" }).then((r) => r.text()).then((d) => startSerializer.parse(d));
        staticClientCache == null ? void 0 : staticClientCache.set(url, result);
      }
      return result;
    }
  });
});
function extractFormDataContext(formData) {
  const serializedContext = formData.get("__TSR_CONTEXT");
  formData.delete("__TSR_CONTEXT");
  if (typeof serializedContext !== "string") return {
    context: {},
    data: formData
  };
  try {
    return {
      context: startSerializer.parse(serializedContext),
      data: formData
    };
  } catch {
    return { data: formData };
  }
}
function flattenMiddlewares(middlewares) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware) => {
    middleware.forEach((m) => {
      if (m.options.middleware) recurse(m.options.middleware);
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares);
  return flattened;
}
var applyMiddleware = async (middlewareFn, ctx, nextFn) => {
  return middlewareFn({
    ...ctx,
    next: async (userCtx = {}) => {
      var _a, _b;
      return nextFn({
        ...ctx,
        ...userCtx,
        context: {
          ...ctx.context,
          ...userCtx.context
        },
        sendContext: {
          ...ctx.sendContext,
          ...(_a = userCtx.sendContext) != null ? _a : {}
        },
        headers: mergeHeaders(ctx.headers, userCtx.headers),
        result: userCtx.result !== void 0 ? userCtx.result : ctx.response === "raw" ? userCtx : ctx.result,
        error: (_b = userCtx.error) != null ? _b : ctx.error
      });
    }
  });
};
function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = validator["~standard"].validate(input);
    if (result instanceof Promise) throw new Error("Async validation not supported");
    if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) return validator.parse(input);
  if (typeof validator === "function") return validator(input);
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    _types: void 0,
    options: {
      validator: options.validator,
      validateClient: options.validateClient,
      client: async ({ next, sendContext, ...ctx }) => {
        var _a;
        const payload = {
          ...ctx,
          context: sendContext,
          type: typeof ctx.type === "function" ? ctx.type(ctx) : ctx.type
        };
        if (ctx.type === "static" && true && typeof document !== "undefined") {
          invariant(serverFnStaticCache, "serverFnStaticCache.fetchItem is not available!");
          const result = await serverFnStaticCache.fetchItem(payload);
          if (result) {
            if (result.error) throw result.error;
            return next(result.ctx);
          }
          warning(result, `No static cache item found for ${payload.functionId}__${JSON.stringify(payload.data)}, falling back to server function...`);
        }
        return next(await ((_a = options.extractedFn) == null ? void 0 : _a.call(options, payload)));
      },
      server: async ({ next, ...ctx }) => {
        var _a;
        const result = await ((_a = options.serverFn) == null ? void 0 : _a.call(options, ctx));
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
function sanitizeBase$1(base) {
  return base.replace(/^\/|\/$/g, "");
}
var createServerRpc = (functionId, serverBase, splitImportFn) => {
  invariant(splitImportFn, "\u{1F6A8}splitImportFn required for the server functions server runtime, but was not provided.");
  const sanitizedAppBase = sanitizeBase$1("/");
  const sanitizedServerBase = sanitizeBase$1(serverBase);
  const url = `${sanitizedAppBase ? `/${sanitizedAppBase}` : ``}/${sanitizedServerBase}/${functionId}`;
  return Object.assign(splitImportFn, {
    url,
    functionId
  });
};
function requireServerEnv(name) {
  var _a;
  const value = (_a = process.env[name]) == null ? void 0 : _a.trim();
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}
function getDatabaseUrl() {
  const databaseUrl = requireServerEnv("DATABASE_URL");
  if (databaseUrl.includes("[YOUR-PASSWORD]")) throw new Error("DATABASE_URL still contains the placeholder [YOUR-PASSWORD]. Replace it with your real database password.");
  return databaseUrl;
}
function getSupabaseServerEnv() {
  return {
    supabaseUrl: requireServerEnv("SUPABASE_URL"),
    supabaseAnonKey: requireServerEnv("SUPABASE_ANON_KEY")
  };
}
function getSupabaseServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseServerEnv();
  return createServerClient(supabaseUrl, supabaseAnonKey, { cookies: {
    async getAll() {
      var _a;
      const cookies = (_a = await parseCookies()) != null ? _a : {};
      return Object.entries(cookies).map(([name, value]) => ({
        name,
        value: value != null ? value : ""
      }));
    },
    async setAll(cookiesToSet) {
      for (const { name, value, options } of cookiesToSet) await setCookie(name, value, options);
    }
  } });
}
var globalForPrisma = globalThis;
function createPrismaClient() {
  return new PrismaClient({ datasources: { db: { url: getDatabaseUrl() } } });
}
function getPrismaClient() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrismaClient();
  return client;
}
var prisma = new Proxy({}, { get(_target, prop) {
  const client = getPrismaClient();
  const value = client[prop];
  return typeof value === "function" ? value.bind(client) : value;
} });

async function getAuthUser$1() {
  const { data: { user } } = await getSupabaseServerClient().auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
var getUserProjects_createServerFn_handler = createServerRpc("src_server_projects_ts--getUserProjects_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getUserProjects.__executeServer(opts, signal);
});
var getUserProjects = createServerFn({ method: "GET" }).handler(getUserProjects_createServerFn_handler, async () => {
  const authUser = await getAuthUser$1();
  return (await prisma.projectMember.findMany({
    where: { userId: authUser.id },
    include: { project: { include: { _count: { select: { tasks: true } } } } },
    orderBy: { project: { updatedAt: "desc" } }
  })).map((m) => ({
    ...m.project,
    role: m.role
  }));
});
var getProject_createServerFn_handler = createServerRpc("src_server_projects_ts--getProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getProject.__executeServer(opts, signal);
});
var getProject = createServerFn({ method: "GET" }).validator((data) => data).handler(getProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser$1();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership) throw new Error("Not a member of this project");
  return {
    ...await prisma.project.findUniqueOrThrow({
      where: { id: data.projectId },
      include: {
        members: {
          include: { user: true },
          orderBy: { createdAt: "asc" }
        },
        _count: { select: { tasks: true } }
      }
    }),
    currentUserRole: membership.role
  };
});
var createProject_createServerFn_handler = createServerRpc("src_server_projects_ts--createProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return createProject.__executeServer(opts, signal);
});
var createProject = createServerFn({ method: "POST" }).validator((data) => data).handler(createProject_createServerFn_handler, async ({ data }) => {
  var _a, _b;
  const authUser = await getAuthUser$1();
  return await prisma.project.create({ data: {
    name: data.name,
    description: (_a = data.description) != null ? _a : null,
    color: (_b = data.color) != null ? _b : "#3b82f6",
    ownerId: authUser.id,
    members: { create: {
      userId: authUser.id,
      role: ProjectRole.OWNER
    } }
  } });
});
var updateProject_createServerFn_handler = createServerRpc("src_server_projects_ts--updateProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return updateProject.__executeServer(opts, signal);
});
var updateProject = createServerFn({ method: "POST" }).validator((data) => data).handler(updateProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser$1();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Insufficient permissions");
  return await prisma.project.update({
    where: { id: data.projectId },
    data: {
      ...data.name !== void 0 && { name: data.name },
      ...data.description !== void 0 && { description: data.description },
      ...data.color !== void 0 && { color: data.color }
    }
  });
});
var deleteProject_createServerFn_handler = createServerRpc("src_server_projects_ts--deleteProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return deleteProject.__executeServer(opts, signal);
});
var deleteProject = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteProject_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser$1();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || membership.role !== "OWNER") throw new Error("Only the owner can delete a project");
  await prisma.project.delete({ where: { id: data.projectId } });
  return { success: true };
});
var addProjectMember_createServerFn_handler = createServerRpc("src_server_projects_ts--addProjectMember_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return addProjectMember.__executeServer(opts, signal);
});
var addProjectMember = createServerFn({ method: "POST" }).validator((data) => data).handler(addProjectMember_createServerFn_handler, async ({ data }) => {
  var _a;
  const authUser = await getAuthUser$1();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Insufficient permissions");
  const targetUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (!targetUser) return { error: "User not found with that email" };
  if (await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: targetUser.id
  } } })) return { error: "User is already a member" };
  await prisma.projectMember.create({ data: {
    projectId: data.projectId,
    userId: targetUser.id,
    role: (_a = data.role) != null ? _a : ProjectRole.MEMBER
  } });
  return { error: null };
});
var removeProjectMember_createServerFn_handler = createServerRpc("src_server_projects_ts--removeProjectMember_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return removeProjectMember.__executeServer(opts, signal);
});
var removeProjectMember = createServerFn({ method: "POST" }).validator((data) => data).handler(removeProjectMember_createServerFn_handler, async ({ data }) => {
  const authUser = await getAuthUser$1();
  const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: authUser.id
  } } });
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) throw new Error("Insufficient permissions");
  if (data.userId === authUser.id) throw new Error("Cannot remove yourself");
  await prisma.projectMember.delete({ where: { projectId_userId: {
    projectId: data.projectId,
    userId: data.userId
  } } });
  return { success: true };
});

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Error extends Error {
  constructor(message, opts = {}) {
    super(message, opts);
    __publicField$2(this, "statusCode", 500);
    __publicField$2(this, "fatal", false);
    __publicField$2(this, "unhandled", false);
    __publicField$2(this, "statusMessage");
    __publicField$2(this, "data");
    __publicField$2(this, "cause");
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
__publicField$2(H3Error, "__h3_error__", true);
function createError(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (allowHead && event.method === "HEAD") {
    return true;
  }
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected, allowHead)) {
    throw createError({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function toWebRequest(event) {
  return event.web?.request || new Request(getRequestURL(event), {
    // @ts-ignore Undici option
    duplex: "half",
    method: event.method,
    headers: event.headers,
    body: getRequestWebStream(event)
  });
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseHeaders(event) {
  return event.node.res.getHeaders();
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Event {
  constructor(req, res) {
    __publicField(this, "__is_event__", true);
    // Context
    __publicField(this, "node");
    // Node
    __publicField(this, "web");
    // Web
    __publicField(this, "context", {});
    // Shared
    // Request
    __publicField(this, "_method");
    __publicField(this, "_path");
    __publicField(this, "_headers");
    __publicField(this, "_requestBody");
    // Response
    __publicField(this, "_handled", false);
    // Hooks
    __publicField(this, "_onBeforeResponseCalled");
    __publicField(this, "_onAfterResponseCalled");
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}

//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	__defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/@tanstack/react-start-server/dist/esm/StartServer.js
function StartServer(props) {
	return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
//#endregion
//#region node_modules/@tanstack/react-start-server/dist/esm/defaultStreamHandler.js
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
	request,
	router,
	responseHeaders,
	children: /* @__PURE__ */ jsx(StartServer, { router })
}));
//#endregion
//#region node_modules/@tanstack/start-server-core/dist/esm/h3.js
var eventStorage = new AsyncLocalStorage();
function defineEventHandler$1(handler) {
	return defineEventHandler((event) => {
		return runWithEvent(event, () => handler(event));
	});
}
async function runWithEvent(event, fn) {
	return eventStorage.run(event, fn);
}
function getEvent() {
	const event = eventStorage.getStore();
	if (!event) throw new Error(`No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return event;
}
var HTTPEventSymbol = Symbol("$HTTPEvent");
function isEvent(obj) {
	return typeof obj === "object" && (obj instanceof H3Event || (obj == null ? void 0 : obj[HTTPEventSymbol]) instanceof H3Event || (obj == null ? void 0 : obj.__is_event__) === true);
}
function createWrapperFunction(h3Function) {
	return function(...args) {
		const event = args[0];
		if (!isEvent(event)) args.unshift(getEvent());
		else args[0] = event instanceof H3Event || event.__is_event__ ? event : event[HTTPEventSymbol];
		return h3Function(...args);
	};
}
var getResponseStatus$1 = createWrapperFunction(getResponseStatus);
var getResponseHeaders$1 = createWrapperFunction(getResponseHeaders);
function requestHandler(handler) {
	return handler;
}
//#endregion
//#region node_modules/@tanstack/start-server-core/dist/esm/virtual-modules.js
var VIRTUAL_MODULES = {
	routeTree: "tanstack-start-route-tree:v",
	startManifest: "tanstack-start-manifest:v",
	serverFnManifest: "tanstack-start-server-fn-manifest:v"
};
//#endregion
//#region node_modules/@tanstack/start-server-core/dist/esm/loadVirtualModule.js
async function loadVirtualModule(id) {
	switch (id) {
		case VIRTUAL_MODULES.routeTree: return await Promise.resolve().then(() => routeTree_gen_exports);
		case VIRTUAL_MODULES.startManifest: return await import('./_tanstack-start-manifest_v-BXVPOEVS.mjs');
		case VIRTUAL_MODULES.serverFnManifest: return await import('./_tanstack-start-server-fn-manifest_v-AwQZ3u3-.mjs');
		default: throw new Error(`Unknown virtual module: ${id}`);
	}
}
//#endregion
//#region node_modules/@tanstack/start-server-core/dist/esm/router-manifest.js
async function getStartManifest(opts) {
	const { tsrStartManifest } = await loadVirtualModule(VIRTUAL_MODULES.startManifest);
	const startManifest = tsrStartManifest();
	const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
	rootRoute.assets = rootRoute.assets || [];
	let script = `import('${startManifest.clientEntry}')`;
	rootRoute.assets.push({
		tag: "script",
		attrs: {
			type: "module",
			suppressHydrationWarning: true,
			async: true
		},
		children: script
	});
	return {
		...startManifest,
		routes: Object.fromEntries(Object.entries(startManifest.routes).map(([k, v]) => {
			const { preloads, assets } = v;
			return [k, {
				preloads,
				assets
			}];
		}))
	};
}
//#endregion
//#region node_modules/@tanstack/start-server-core/dist/esm/server-functions-handler.js
function sanitizeBase(base) {
	return base.replace(/^\/|\/$/g, "");
}
async function revive(root, reviver) {
	async function reviveNode(holder2, key) {
		const value = holder2[key];
		if (value && typeof value === "object") await Promise.all(Object.keys(value).map((k) => reviveNode(value, k)));
		if (reviver) holder2[key] = await reviver(key, holder2[key]);
	}
	const holder = { "": root };
	await reviveNode(holder, "");
	return holder[""];
}
async function reviveServerFns(key, value) {
	if (value && value.__serverFn === true && value.functionId) {
		const serverFn = await getServerFnById(value.functionId);
		return async (opts, signal) => {
			return (await serverFn(opts ?? {}, signal)).result;
		};
	}
	return value;
}
async function getServerFnById(serverFnId) {
	const { default: serverFnManifest } = await loadVirtualModule(VIRTUAL_MODULES.serverFnManifest);
	const serverFnInfo = serverFnManifest[serverFnId];
	if (!serverFnInfo) {
		console.info("serverFnManifest", serverFnManifest);
		throw new Error("Server function info not found for " + serverFnId);
	}
	const fnModule = await serverFnInfo.importer();
	if (!fnModule) {
		console.info("serverFnInfo", serverFnInfo);
		throw new Error("Server function module not resolved for " + serverFnId);
	}
	const action = fnModule[serverFnInfo.functionName];
	if (!action) {
		console.info("serverFnInfo", serverFnInfo);
		console.info("fnModule", fnModule);
		throw new Error(`Server function module export not resolved for serverFn ID: ${serverFnId}`);
	}
	return action;
}
async function parsePayload(payload) {
	const parsedPayload = startSerializer.parse(payload);
	await revive(parsedPayload, reviveServerFns);
	return parsedPayload;
}
var handleServerAction = async ({ request }) => {
	const controller = new AbortController();
	const signal = controller.signal;
	const abort = () => controller.abort();
	request.signal.addEventListener("abort", abort);
	const method = request.method;
	const url = new URL(request.url, "http://localhost:3000");
	const regex = new RegExp(`${sanitizeBase("/_serverFn")}/([^/?#]+)`);
	const match = url.pathname.match(regex);
	const serverFnId = match ? match[1] : null;
	const search = Object.fromEntries(url.searchParams.entries());
	const isCreateServerFn = "createServerFn" in search;
	const isRaw = "raw" in search;
	if (typeof serverFnId !== "string") throw new Error("Invalid server action param for serverFnId: " + serverFnId);
	const action = await getServerFnById(serverFnId);
	const formDataContentTypes = ["multipart/form-data", "application/x-www-form-urlencoded"];
	const response = await (async () => {
		try {
			let result = await (async () => {
				if (request.headers.get("Content-Type") && formDataContentTypes.some((type) => {
					var _a;
					return (_a = request.headers.get("Content-Type")) == null ? void 0 : _a.includes(type);
				})) {
					invariant(method.toLowerCase() !== "get", "GET requests with FormData payloads are not supported");
					return await action(await request.formData(), signal);
				}
				if (method.toLowerCase() === "get") {
					let payload2 = search;
					if (isCreateServerFn) payload2 = search.payload;
					payload2 = payload2 ? await parsePayload(payload2) : payload2;
					return await action(payload2, signal);
				}
				const payload = await parsePayload(await request.text());
				if (isCreateServerFn) return await action(payload, signal);
				return await action(...payload, signal);
			})();
			if (result.result instanceof Response) return result.result;
			if (!isCreateServerFn) {
				result = result.result;
				if (result instanceof Response) return result;
			}
			if (isNotFound(result)) return isNotFoundResponse(result);
			return new Response(result !== void 0 ? startSerializer.stringify(result) : void 0, {
				status: getResponseStatus$1(getEvent()),
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			if (error instanceof Response) return error;
			if (isNotFound(error)) return isNotFoundResponse(error);
			console.info();
			console.info("Server Fn Error!");
			console.info();
			console.error(error);
			console.info();
			return new Response(startSerializer.stringify(error), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	})();
	request.signal.removeEventListener("abort", abort);
	if (isRaw) return response;
	return response;
};
function isNotFoundResponse(error) {
	const { headers, ...rest } = error;
	return new Response(JSON.stringify(rest), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			...headers || {}
		}
	});
}
//#endregion
//#region node_modules/@tanstack/start-server-core/dist/esm/constants.js
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
//#endregion
//#region node_modules/@tanstack/start-server-core/dist/esm/createStartHandler.js
function getStartResponseHeaders(opts) {
	return mergeHeaders(getResponseHeaders$1(), { "Content-Type": "text/html; charset=UTF-8" }, ...opts.router.state.matches.map((match) => {
		return match.headers;
	}));
}
function createStartHandler({ createRouter }) {
	let routeTreeModule = null;
	let startRoutesManifest = null;
	let processedServerRouteTree = void 0;
	return (cb) => {
		const originalFetch = globalThis.fetch;
		const startRequestResolver = async ({ request }) => {
			globalThis.fetch = async function(input, init) {
				function resolve(url2, requestOptions) {
					return startRequestResolver({ request: new Request(url2, requestOptions) });
				}
				function getOrigin() {
					return request.headers.get("Origin") || request.headers.get("Referer") || "http://localhost";
				}
				if (typeof input === "string" && input.startsWith("/")) return resolve(new URL(input, getOrigin()), init);
				else if (typeof input === "object" && "url" in input && typeof input.url === "string" && input.url.startsWith("/")) return resolve(new URL(input.url, getOrigin()), init);
				return originalFetch(input, init);
			};
			const url = new URL(request.url);
			const href = url.href.replace(url.origin, "");
			const APP_BASE = "/";
			const router = await createRouter();
			const history = createMemoryHistory({ initialEntries: [href] });
			const isPrerendering = process.env.TSS_PRERENDERING === "true";
			let isShell = process.env.TSS_SHELL === "true";
			if (isPrerendering && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
			router.update({
				history,
				isShell,
				isPrerendering
			});
			const response = await (async () => {
				try {
					const serverFnBase = joinPaths([
						APP_BASE,
						trimPath("/_serverFn"),
						"/"
					]);
					if (href.startsWith(serverFnBase)) return await handleServerAction({ request });
					if (routeTreeModule === null) try {
						routeTreeModule = await loadVirtualModule(VIRTUAL_MODULES.routeTree);
						if (routeTreeModule.serverRouteTree) processedServerRouteTree = processRouteTree({
							routeTree: routeTreeModule.serverRouteTree,
							initRoute: (route, i) => {
								route.init({ originalIndex: i });
							}
						});
					} catch (e) {
						console.log(e);
					}
					const executeRouter = () => runWithStartContext({ router }, async () => {
						const splitRequestAcceptHeader = (request.headers.get("Accept") || "*/*").split(",");
						if (!["*/*", "text/html"].some((mimeType) => splitRequestAcceptHeader.some((acceptedMimeType) => acceptedMimeType.trim().startsWith(mimeType)))) return json({ error: "Only HTML requests are supported here" }, { status: 500 });
						if (startRoutesManifest === null) startRoutesManifest = await getStartManifest({ basePath: APP_BASE });
						attachRouterServerSsrUtils(router, startRoutesManifest);
						await router.load();
						if (router.state.redirect) return router.state.redirect;
						await router.serverSsr.dehydrate();
						return await cb({
							request,
							router,
							responseHeaders: getStartResponseHeaders({ router })
						});
					});
					if (processedServerRouteTree) {
						const [_matchedRoutes, response2] = await handleServerRoutes({
							processedServerRouteTree,
							router,
							request,
							basePath: APP_BASE,
							executeRouter
						});
						if (response2) return response2;
					}
					return await executeRouter();
				} catch (err) {
					if (err instanceof Response) return err;
					throw err;
				}
			})();
			if (isRedirect(response)) {
				if (isResolvedRedirect(response)) {
					if (request.headers.get("x-tsr-redirect") === "manual") return json({
						...response.options,
						isSerializedRedirect: true
					}, { headers: response.headers });
					return response;
				}
				if (response.options.to && typeof response.options.to === "string" && !response.options.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(response.options)}`);
				if ([
					"params",
					"search",
					"hash"
				].some((d) => typeof response.options[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(response.options).filter((d) => typeof response.options[d] === "function").map((d) => `"${d}"`).join(", ")}`);
				const redirect = router.resolveRedirect(response);
				if (request.headers.get("x-tsr-redirect") === "manual") return json({
					...response.options,
					isSerializedRedirect: true
				}, { headers: response.headers });
				return redirect;
			}
			return response;
		};
		return requestHandler(startRequestResolver);
	};
}
async function handleServerRoutes(opts) {
	var _a, _b;
	const pathname = new URL(opts.request.url).pathname;
	const serverTreeResult = getMatchedRoutes({
		pathname,
		basepath: opts.basePath,
		caseSensitive: true,
		routesByPath: opts.processedServerRouteTree.routesByPath,
		routesById: opts.processedServerRouteTree.routesById,
		flatRoutes: opts.processedServerRouteTree.flatRoutes
	});
	const routeTreeResult = opts.router.getMatchedRoutes(pathname, void 0);
	let response;
	let matchedRoutes = [];
	matchedRoutes = serverTreeResult.matchedRoutes;
	if (routeTreeResult.foundRoute) {
		if (serverTreeResult.matchedRoutes.length < routeTreeResult.matchedRoutes.length) {
			const closestCommon = [...routeTreeResult.matchedRoutes].reverse().find((r) => {
				return opts.processedServerRouteTree.routesById[r.id] !== void 0;
			});
			if (closestCommon) {
				let routeId = closestCommon.id;
				matchedRoutes = [];
				do {
					const route = opts.processedServerRouteTree.routesById[routeId];
					if (!route) break;
					matchedRoutes.push(route);
					routeId = (_a = route.parentRoute) == null ? void 0 : _a.id;
				} while (routeId);
				matchedRoutes.reverse();
			}
		}
	}
	if (matchedRoutes.length) {
		const middlewares = flattenMiddlewares(matchedRoutes.flatMap((r) => r.options.middleware).filter(Boolean)).map((d) => d.options.server);
		if ((_b = serverTreeResult.foundRoute) == null ? void 0 : _b.options.methods) {
			const method = Object.keys(serverTreeResult.foundRoute.options.methods).find((method2) => method2.toLowerCase() === opts.request.method.toLowerCase());
			if (method) {
				const handler = serverTreeResult.foundRoute.options.methods[method];
				if (handler) if (typeof handler === "function") middlewares.push(handlerToMiddleware(handler));
				else {
					if (handler._options.middlewares && handler._options.middlewares.length) middlewares.push(...flattenMiddlewares(handler._options.middlewares).map((d) => d.options.server));
					if (handler._options.handler) middlewares.push(handlerToMiddleware(handler._options.handler));
				}
			}
		}
		middlewares.push(handlerToMiddleware(opts.executeRouter));
		response = (await executeMiddleware(middlewares, {
			request: opts.request,
			context: {},
			params: serverTreeResult.routeParams,
			pathname
		})).response;
	}
	return [matchedRoutes, response];
}
function handlerToMiddleware(handler) {
	return async ({ next: _next, ...rest }) => {
		const response = await handler(rest);
		if (response) return { response };
		return _next(rest);
	};
}
function executeMiddleware(middlewares, ctx) {
	let index = -1;
	const next = async (ctx2) => {
		index++;
		const middleware = middlewares[index];
		if (!middleware) return ctx2;
		const result = await middleware({
			...ctx2,
			next: async (nextCtx) => {
				const nextResult = await next({
					...ctx2,
					...nextCtx,
					context: {
						...ctx2.context,
						...(nextCtx == null ? void 0 : nextCtx.context) || {}
					}
				});
				return Object.assign(ctx2, handleCtxResult(nextResult));
			}
		}).catch((err) => {
			if (isSpecialResponse(err)) return { response: err };
			throw err;
		});
		return Object.assign(ctx2, handleCtxResult(result));
	};
	return handleCtxResult(next(ctx));
}
function handleCtxResult(result) {
	if (isSpecialResponse(result)) return { response: result };
	return result;
}
function isSpecialResponse(err) {
	return isResponse(err) || isRedirect(err);
}
function isResponse(response) {
	return response instanceof Response;
}
//#endregion
//#region src/styles/app.css?url
var app_default = "/assets/app-fCCDN7CO.css";
//#endregion
//#region src/server/auth.ts
var projectRoleRank = {
	VIEWER: 0,
	MEMBER: 1,
	ADMIN: 2,
	OWNER: 3
};
async function syncUserFromAuth(authUser) {
	const email = authUser.email?.trim();
	if (!email) throw new Error("Authenticated user is missing an email address");
	const fullName = authUser.user_metadata?.full_name ?? null;
	const avatarUrl = authUser.user_metadata?.avatar_url ?? null;
	return prisma.$transaction(async (tx) => {
		const existingById = await tx.user.findUnique({ where: { id: authUser.id } });
		const existingByEmail = await tx.user.findUnique({ where: { email } });
		if (!existingById && !existingByEmail) return tx.user.create({ data: {
			id: authUser.id,
			email,
			fullName,
			avatarUrl
		} });
		if (!existingByEmail || existingByEmail.id === authUser.id) return tx.user.update({
			where: { id: authUser.id },
			data: {
				email,
				fullName,
				avatarUrl
			}
		});
		const canonicalUser = existingById ?? await tx.user.create({ data: {
			id: authUser.id,
			email: `${authUser.id}@sync.local.invalid`,
			fullName,
			avatarUrl
		} });
		const duplicateUser = existingByEmail;
		const duplicateMemberships = await tx.projectMember.findMany({ where: { userId: duplicateUser.id } });
		const canonicalMemberships = await tx.projectMember.findMany({ where: { userId: canonicalUser.id } });
		const canonicalMembershipsByProject = new Map(canonicalMemberships.map((membership) => [membership.projectId, membership]));
		for (const membership of duplicateMemberships) {
			const canonicalMembership = canonicalMembershipsByProject.get(membership.projectId);
			if (!canonicalMembership) {
				await tx.projectMember.update({
					where: { id: membership.id },
					data: { userId: canonicalUser.id }
				});
				continue;
			}
			if (projectRoleRank[membership.role] > projectRoleRank[canonicalMembership.role]) await tx.projectMember.update({
				where: { id: canonicalMembership.id },
				data: { role: membership.role }
			});
			await tx.projectMember.delete({ where: { id: membership.id } });
		}
		await tx.project.updateMany({
			where: { ownerId: duplicateUser.id },
			data: { ownerId: canonicalUser.id }
		});
		await tx.task.updateMany({
			where: { creatorId: duplicateUser.id },
			data: { creatorId: canonicalUser.id }
		});
		await tx.task.updateMany({
			where: { assigneeId: duplicateUser.id },
			data: { assigneeId: canonicalUser.id }
		});
		await tx.taskComment.updateMany({
			where: { authorId: duplicateUser.id },
			data: { authorId: canonicalUser.id }
		});
		await tx.user.delete({ where: { id: duplicateUser.id } });
		return tx.user.update({
			where: { id: canonicalUser.id },
			data: {
				email,
				fullName,
				avatarUrl
			}
		});
	});
}
var fetchUser_createServerFn_handler = createServerRpc("src_server_auth_ts--fetchUser_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return fetchUser.__executeServer(opts, signal);
});
var fetchUser = createServerFn({ method: "GET" }).handler(fetchUser_createServerFn_handler, async () => {
	const { data: { user: authUser } } = await getSupabaseServerClient().auth.getUser();
	if (!authUser) return null;
	return await syncUserFromAuth(authUser);
});
var loginFn_createServerFn_handler = createServerRpc("src_server_auth_ts--loginFn_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return loginFn.__executeServer(opts, signal);
});
var loginFn = createServerFn({ method: "POST" }).validator((data) => data).handler(loginFn_createServerFn_handler, async ({ data }) => {
	const { error } = await getSupabaseServerClient().auth.signInWithPassword({
		email: data.email,
		password: data.password
	});
	if (error) return { error: error.message };
	return { error: null };
});
var signupFn_createServerFn_handler = createServerRpc("src_server_auth_ts--signupFn_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return signupFn.__executeServer(opts, signal);
});
var signupFn = createServerFn({ method: "POST" }).validator((data) => data).handler(signupFn_createServerFn_handler, async ({ data }) => {
	const { error } = await getSupabaseServerClient().auth.signUp({
		email: data.email,
		password: data.password,
		options: { data: { full_name: data.fullName } }
	});
	if (error) return { error: error.message };
	return { error: null };
});
var logoutFn_createServerFn_handler = createServerRpc("src_server_auth_ts--logoutFn_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return logoutFn.__executeServer(opts, signal);
});
var logoutFn = createServerFn({ method: "POST" }).handler(logoutFn_createServerFn_handler, async () => {
	await getSupabaseServerClient().auth.signOut();
	return { success: true };
});
//#endregion
//#region src/routes/__root.tsx
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ProVisioners TaskFlow " }
		],
		links: [{
			rel: "stylesheet",
			href: app_default
		}, {
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		}]
	}),
	beforeLoad: async () => {
		return { user: await fetchUser() };
	},
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [/* @__PURE__ */ jsx(HeadContent, {}), /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()` } })] }), /* @__PURE__ */ jsxs("body", { children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
//#endregion
//#region src/routes/signup.tsx
var $$splitComponentImporter$9 = () => import('./signup-HcP7KG-O.mjs');
var Route$10 = createFileRoute("/signup")({
	beforeLoad: ({ context }) => {
		if (context.user) throw redirect({ to: "/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/login.tsx
var $$splitComponentImporter$8 = () => import('./login-FeU7gYFM.mjs');
var Route$9 = createFileRoute("/login")({
	beforeLoad: ({ context }) => {
		if (context.user) throw redirect({ to: "/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/_authed.tsx
var $$splitComponentImporter$7 = () => import('./_authed-Cb_pc8Tn.mjs');
var Route$8 = createFileRoute("/_authed")({
	beforeLoad: ({ context }) => {
		if (!context.user) throw redirect({ to: "/login" });
		return { user: context.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/index.tsx
var Route$7 = createFileRoute("/")({ beforeLoad: ({ context }) => {
	if (context.user) throw redirect({ to: "/dashboard" });
	throw redirect({ to: "/login" });
} });
//#endregion
//#region src/routes/_authed/projects.tsx
var $$splitComponentImporter$6 = () => import('./projects-DMNrXMn5.mjs');
var Route$6 = createFileRoute("/_authed/projects")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
//#endregion
//#region src/server/dashboard.ts
var getDashboardStats_createServerFn_handler = createServerRpc("src_server_dashboard_ts--getDashboardStats_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return getDashboardStats.__executeServer(opts, signal);
});
var getDashboardStats = createServerFn({ method: "GET" }).handler(getDashboardStats_createServerFn_handler, async () => {
	const { data: { user } } = await getSupabaseServerClient().auth.getUser();
	if (!user) throw new Error("Unauthorized");
	const projectIds = (await prisma.projectMember.findMany({
		where: { userId: user.id },
		select: { projectId: true }
	})).map((m) => m.projectId);
	const [totalTasks, completedTasks, overdueTasks, recentTasks, dueSoonTasks] = await Promise.all([
		prisma.task.count({ where: { projectId: { in: projectIds } } }),
		prisma.task.count({ where: {
			projectId: { in: projectIds },
			status: "DONE"
		} }),
		prisma.task.count({ where: {
			projectId: { in: projectIds },
			status: { notIn: ["DONE", "CANCELLED"] },
			dueDate: { lt: /* @__PURE__ */ new Date() }
		} }),
		prisma.task.findMany({
			where: { projectId: { in: projectIds } },
			include: { project: { select: { name: true } } },
			orderBy: { createdAt: "desc" },
			take: 8
		}),
		prisma.task.findMany({
			where: {
				projectId: { in: projectIds },
				status: { notIn: ["DONE", "CANCELLED"] },
				dueDate: {
					gte: /* @__PURE__ */ new Date(),
					lte: new Date(Date.now() + 10080 * 60 * 1e3)
				}
			},
			include: { project: { select: { name: true } } },
			orderBy: { dueDate: "asc" },
			take: 8
		})
	]);
	return {
		totalProjects: projectIds.length,
		totalTasks,
		completedTasks,
		overdueTasks,
		recentTasks,
		dueSoonTasks
	};
});
//#endregion
//#region src/routes/_authed/dashboard.tsx
var $$splitComponentImporter$5 = () => import('./dashboard-BrZS_9XB.mjs');
var Route$5 = createFileRoute("/_authed/dashboard")({
	loader: () => getDashboardStats(),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/_authed/projects.index.tsx
var $$splitComponentImporter$4 = () => import('./projects.index-Bve8FL9J.mjs');
var Route$4 = createFileRoute("/_authed/projects/")({
	loader: () => getUserProjects(),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/_authed/projects.new.tsx
var $$splitComponentImporter$3 = () => import('./projects.new-BgWUbcil.mjs');
var Route$3 = createFileRoute("/_authed/projects/new")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/_authed/projects.$projectId.tsx
var $$splitComponentImporter$2 = () => import('./projects._projectId-DAhq12Rt.mjs');
var Route$2 = createFileRoute("/_authed/projects/$projectId")({
	loader: ({ params }) => getProject({ data: { projectId: params.projectId } }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/server/tasks.ts
async function getAuthUser() {
	const { data: { user } } = await getSupabaseServerClient().auth.getUser();
	if (!user) throw new Error("Unauthorized");
	return user;
}
async function requireProjectMember(projectId, userId) {
	const membership = await prisma.projectMember.findUnique({ where: { projectId_userId: {
		projectId,
		userId
	} } });
	if (!membership) throw new Error("Not a member of this project");
	return membership;
}
function clampIndex(index, max) {
	return Math.max(0, Math.min(index, max));
}
var getTasksByProject_createServerFn_handler = createServerRpc("src_server_tasks_ts--getTasksByProject_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return getTasksByProject.__executeServer(opts, signal);
});
var getTasksByProject = createServerFn({ method: "GET" }).validator((data) => data).handler(getTasksByProject_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	await requireProjectMember(data.projectId, authUser.id);
	const where = { projectId: data.projectId };
	if (data.status) where.status = data.status;
	if (data.priority) where.priority = data.priority;
	if (data.assigneeId) where.assigneeId = data.assigneeId;
	if (data.search) where.OR = [{ title: {
		contains: data.search,
		mode: "insensitive"
	} }, { description: {
		contains: data.search,
		mode: "insensitive"
	} }];
	return prisma.task.findMany({
		where,
		include: {
			creator: true,
			assignee: true,
			_count: { select: { comments: true } }
		},
		orderBy: [{ position: "asc" }, { createdAt: "desc" }]
	});
});
var getTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--getTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return getTask.__executeServer(opts, signal);
});
var getTask = createServerFn({ method: "GET" }).validator((data) => data).handler(getTask_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	const task = await prisma.task.findUniqueOrThrow({
		where: { id: data.taskId },
		include: {
			creator: true,
			assignee: true,
			project: true,
			comments: {
				include: { author: true },
				orderBy: { createdAt: "asc" }
			}
		}
	});
	await requireProjectMember(task.projectId, authUser.id);
	return task;
});
var createTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--createTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return createTask.__executeServer(opts, signal);
});
var createTask = createServerFn({ method: "POST" }).validator((data) => data).handler(createTask_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	await requireProjectMember(data.projectId, authUser.id);
	const maxPosition = await prisma.task.aggregate({
		where: {
			projectId: data.projectId,
			status: data.status ?? "TODO"
		},
		_max: { position: true }
	});
	return prisma.task.create({
		data: {
			title: data.title,
			description: data.description ?? null,
			status: data.status ?? "TODO",
			priority: data.priority ?? "NONE",
			dueDate: data.dueDate ? new Date(data.dueDate) : null,
			position: (maxPosition._max.position ?? -1) + 1,
			projectId: data.projectId,
			creatorId: authUser.id,
			assigneeId: data.assigneeId ?? null
		},
		include: {
			creator: true,
			assignee: true
		}
	});
});
var updateTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--updateTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return updateTask.__executeServer(opts, signal);
});
var updateTask = createServerFn({ method: "POST" }).validator((data) => data).handler(updateTask_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	const task = await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } });
	await requireProjectMember(task.projectId, authUser.id);
	const updateData = {};
	if (data.title !== void 0) updateData.title = data.title;
	if (data.description !== void 0) updateData.description = data.description;
	if (data.status !== void 0) {
		updateData.status = data.status;
		if (data.status !== task.status) updateData.position = ((await prisma.task.aggregate({
			where: {
				projectId: task.projectId,
				status: data.status
			},
			_max: { position: true }
		}))._max.position ?? -1) + 1;
	}
	if (data.priority !== void 0) updateData.priority = data.priority;
	if (data.dueDate !== void 0) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
	if (data.assigneeId !== void 0) updateData.assigneeId = data.assigneeId;
	return prisma.task.update({
		where: { id: data.taskId },
		data: updateData,
		include: {
			creator: true,
			assignee: true
		}
	});
});
var moveTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--moveTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return moveTask.__executeServer(opts, signal);
});
var moveTask = createServerFn({ method: "POST" }).validator((data) => data).handler(moveTask_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	await requireProjectMember((await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } })).projectId, authUser.id);
	return prisma.$transaction(async (tx) => {
		const currentTask = await tx.task.findUniqueOrThrow({ where: { id: data.taskId } });
		const sourceWithoutCurrent = (await tx.task.findMany({
			where: {
				projectId: currentTask.projectId,
				status: currentTask.status
			},
			orderBy: [{ position: "asc" }, { createdAt: "asc" }]
		})).filter((sourceTask) => sourceTask.id !== currentTask.id);
		if (currentTask.status === data.targetStatus) {
			const nextIndex = clampIndex(data.targetIndex, sourceWithoutCurrent.length);
			const reorderedTasks = [
				...sourceWithoutCurrent.slice(0, nextIndex),
				currentTask,
				...sourceWithoutCurrent.slice(nextIndex)
			];
			await Promise.all(reorderedTasks.map((reorderedTask, index) => tx.task.update({
				where: { id: reorderedTask.id },
				data: { position: index }
			})));
		} else {
			const targetTasks = await tx.task.findMany({
				where: {
					projectId: currentTask.projectId,
					status: data.targetStatus
				},
				orderBy: [{ position: "asc" }, { createdAt: "asc" }]
			});
			const nextIndex = clampIndex(data.targetIndex, targetTasks.length);
			const reorderedTargetTasks = [
				...targetTasks.slice(0, nextIndex),
				currentTask,
				...targetTasks.slice(nextIndex)
			];
			await Promise.all([...sourceWithoutCurrent.map((sourceTask, index) => tx.task.update({
				where: { id: sourceTask.id },
				data: { position: index }
			})), ...reorderedTargetTasks.map((targetTask, index) => tx.task.update({
				where: { id: targetTask.id },
				data: targetTask.id === currentTask.id ? {
					status: data.targetStatus,
					position: index
				} : { position: index }
			}))]);
		}
		return tx.task.findUniqueOrThrow({
			where: { id: data.taskId },
			include: {
				creator: true,
				assignee: true,
				_count: { select: { comments: true } }
			}
		});
	});
});
var deleteTask_createServerFn_handler = createServerRpc("src_server_tasks_ts--deleteTask_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return deleteTask.__executeServer(opts, signal);
});
var deleteTask = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteTask_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	await requireProjectMember((await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } })).projectId, authUser.id);
	await prisma.task.delete({ where: { id: data.taskId } });
	return { success: true };
});
var addComment_createServerFn_handler = createServerRpc("src_server_tasks_ts--addComment_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return addComment.__executeServer(opts, signal);
});
var addComment = createServerFn({ method: "POST" }).validator((data) => data).handler(addComment_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	await requireProjectMember((await prisma.task.findUniqueOrThrow({ where: { id: data.taskId } })).projectId, authUser.id);
	return prisma.taskComment.create({
		data: {
			content: data.content,
			taskId: data.taskId,
			authorId: authUser.id
		},
		include: { author: true }
	});
});
var getProjectMembers_createServerFn_handler = createServerRpc("src_server_tasks_ts--getProjectMembers_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return getProjectMembers.__executeServer(opts, signal);
});
var getProjectMembers = createServerFn({ method: "GET" }).validator((data) => data).handler(getProjectMembers_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	await requireProjectMember(data.projectId, authUser.id);
	return prisma.projectMember.findMany({
		where: { projectId: data.projectId },
		include: { user: true }
	});
});
var deleteComment_createServerFn_handler = createServerRpc("src_server_tasks_ts--deleteComment_createServerFn_handler", "/_serverFn", (opts, signal) => {
	return deleteComment.__executeServer(opts, signal);
});
var deleteComment = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteComment_createServerFn_handler, async ({ data }) => {
	const authUser = await getAuthUser();
	if ((await prisma.taskComment.findUniqueOrThrow({ where: { id: data.commentId } })).authorId !== authUser.id) throw new Error("Not authorized to delete this comment");
	await prisma.taskComment.delete({ where: { id: data.commentId } });
	return { success: true };
});
//#endregion
//#region src/routes/_authed/projects.$projectId.index.tsx
var $$splitComponentImporter$1 = () => import('./projects._projectId.index-BfYni3jk.mjs');
var Route$1 = createFileRoute("/_authed/projects/$projectId/")({
	loader: ({ params }) => getTasksByProject({ data: { projectId: params.projectId } }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/_authed/projects.$projectId.settings.tsx
var $$splitComponentImporter = () => import('./projects._projectId.settings-B3I52_UN.mjs');
var Route = createFileRoute("/_authed/projects/$projectId/settings")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var routeTree_gen_exports = /* @__PURE__ */ __exportAll({ routeTree: () => routeTree });
var SignupRoute = Route$10.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$11
});
var LoginRoute = Route$9.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$11
});
var AuthedRoute = Route$8.update({
	id: "/_authed",
	getParentRoute: () => Route$11
});
var IndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var AuthedProjectsRoute = Route$6.update({
	id: "/projects",
	path: "/projects",
	getParentRoute: () => AuthedRoute
});
var AuthedDashboardRoute = Route$5.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthedRoute
});
var AuthedProjectsIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthedProjectsRoute
});
var AuthedProjectsNewRoute = Route$3.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AuthedProjectsRoute
});
var AuthedProjectsProjectIdRoute = Route$2.update({
	id: "/$projectId",
	path: "/$projectId",
	getParentRoute: () => AuthedProjectsRoute
});
var AuthedProjectsProjectIdIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthedProjectsProjectIdRoute
});
var AuthedProjectsProjectIdRouteChildren = {
	AuthedProjectsProjectIdSettingsRoute: Route.update({
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
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent"
	});
}
//#endregion
//#region /~start/default-server-entry.tsx
var default_server_entry_default = createStartHandler({ createRouter: getRouter })(defaultStreamHandler);
//#endregion
//#region /~start/server-entry.tsx
var server_entry_default = defineEventHandler$1(function(event) {
	return default_server_entry_default({ request: toWebRequest(event) });
});

const ssr = /*#__PURE__*/Object.freeze({
	__proto__: null,
	_: signupFn,
	a: deleteComment,
	c: getTask,
	d: updateTask,
	default: server_entry_default,
	f: Route$2,
	g: logoutFn,
	h: loginFn,
	i: createTask,
	l: getTasksByProject,
	m: Route$5,
	n: Route$1,
	o: deleteTask,
	p: Route$4,
	r: addComment,
	s: getProjectMembers,
	t: Route,
	u: moveTask
});

export { prisma as A, ssr as B, Route$5 as R, logoutFn as a, Route$4 as b, createProject as c, Route$2 as d, Route$1 as e, getTasksByProject as f, getUserProjects as g, getTask as h, getProjectMembers as i, createTask as j, deleteTask as k, loginFn as l, moveTask as m, deleteComment as n, addComment as o, Route as p, updateProject as q, addProjectMember as r, signupFn as s, getProject as t, updateTask as u, removeProjectMember as v, deleteProject as w, createServerRpc as x, createServerFn as y, getSupabaseServerClient as z };
//# sourceMappingURL=ssr.mjs.map
