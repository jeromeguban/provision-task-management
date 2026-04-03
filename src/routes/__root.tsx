import {
  Outlet,
  HeadContent,
  Scripts,
  Link,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { User } from "@prisma/client";
import appCss from "@/styles/app.css?url";
import { fetchUser } from "@/server/auth";

interface RouterContext {
  user: User | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ProVisioners TaskFlow " },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
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
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Synchronously apply dark class before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-slate-100">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">404</p>
          <h1 className="text-3xl font-semibold">Page not found</h1>
          <p className="max-w-md text-sm text-slate-300">
            The page you requested does not exist or is no longer available.
          </p>
          <div className="flex gap-3">
            <Link
              to="/"
              className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-medium text-slate-950"
            >
              Go home
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-100"
            >
              Log in
            </Link>
          </div>
        </main>
        <Scripts />
      </body>
    </html>
  );
}
