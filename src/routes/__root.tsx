import {
  Outlet,
  HeadContent,
  Scripts,
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
