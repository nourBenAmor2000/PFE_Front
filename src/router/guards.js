"use client"

import { useAuth } from "@/composables/useAuth"

export function setupRouteGuards(router) {
  router.beforeEach((to, from, next) => {
    const { isAuthenticated, hasPermission } = useAuth()

    // Check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated.value) {
      next("/login")
      return
    }

    // Check role-based permissions
    if (to.meta.requiredRole && !hasPermission(to.meta.requiredRole)) {
      next("/unauthorized")
      return
    }

    // Redirect authenticated users away from auth pages
    if ((to.path === "/login" || to.path === "/register") && isAuthenticated.value) {
      next("/dashboard")
      return
    }

    next()
  })
}
