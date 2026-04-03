import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

let router: ReturnType<typeof createRouter> | undefined

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {
      user: null,
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
  })

  return router
}

export function getRouter() {
  if (!router) {
    router = createRouter()
  }
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
