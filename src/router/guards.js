"use client"

import { useAuth } from "@/composables/useAuth"

export function setupRouteGuards(router) {
  router.beforeEach((to, from, next) => {
    const { isAuthenticated, hasPermission } = useAuth()

    const loggedIn = isAuthenticated.value

    // 1) Routes protégées
    if (to.meta.requiresAuth && !loggedIn) {
      next("/login")
      return
    }

    // 2) Routes réservées aux invités (login, register, forgot-password, verify-email)
    if (to.meta.guestOnly && loggedIn) {
      // tu peux faire plus sophistiqué (rediriger selon rôle),
      // mais pour l'instant on renvoie vers le dashboard
      next("/dashboard")
      return
    }

    // 3) Vérif des rôles
    if (to.meta.requiredRole && !hasPermission(to.meta.requiredRole)) {
      next("/unauthorized")
      return
    }

    next()
  })
}
