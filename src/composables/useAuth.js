"use client"

import { ref, computed } from "vue"
import { useRouter } from "vue-router"

// Global state
const user = ref(null)
const isLoading = ref(false)

export function useAuth() {
  const router = useRouter()

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const isAgentPersonnel = computed(() => userRole.value === "agent_personnel")
  const isAgentRH = computed(() => userRole.value === "agent_rh")
  const isAdminAgence = computed(() => userRole.value === "admin_agence")
  const isAdminGlobal = computed(() => userRole.value === "admin_global")
  const isAgent = computed(
    () => userRole.value === "agent_personnel" || userRole.value === "agent_rh" || userRole.value === "admin_agence",
  )
  const isAdmin = computed(() => userRole.value === "admin_agence" || userRole.value === "admin_global")
  const isClient = computed(() => userRole.value === "client")

  // Initialize auth state from localStorage
  const initAuth = () => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
  }

  // Login function
  const login = async (credentials) => {
    isLoading.value = true
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let role = "client" // default role

      if (credentials.email.includes("admin-global")) {
        role = "admin_global"
      } else if (credentials.email.includes("admin-agence")) {
        role = "admin_agence"
      } else if (credentials.email.includes("agent-rh")) {
        role = "agent_rh"
      } else if (credentials.email.includes("agent")) {
        role = "agent_personnel"
      }

      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        name: credentials.email.split("@")[0],
        email: credentials.email,
        role: role,
        avatar: `https://ui-avatars.com/api/?name=${credentials.email.split("@")[0]}&background=f97316&color=fff`,
        phone: "+1 (555) 123-4567",
        joinDate: new Date().toISOString(),
        verified: true,
        agencyId: role !== "admin_global" && role !== "client" ? Math.floor(Math.random() * 10) + 1 : null,
      }

      user.value = mockUser
      localStorage.setItem("user", JSON.stringify(mockUser))

      return { success: true, user: mockUser }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // Register function
  const register = async (userData) => {
    isLoading.value = true
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser = {
        id: Math.floor(Math.random() * 1000),
        name: userData.name,
        email: userData.email,
        role: userData.role || "client",
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=f97316&color=fff`,
        phone: userData.phone || "",
        joinDate: new Date().toISOString(),
        verified: false,
        agencyId:
          userData.role !== "admin_global" && userData.role !== "client" ? Math.floor(Math.random() * 10) + 1 : null,
      }

      user.value = newUser
      localStorage.setItem("user", JSON.stringify(newUser))

      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = () => {
    user.value = null
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Update user profile
  const updateProfile = async (updates) => {
    if (!user.value) return { success: false, error: "Not authenticated" }

    isLoading.value = true
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedUser = { ...user.value, ...updates }
      user.value = updatedUser
      localStorage.setItem("user", JSON.stringify(updatedUser))

      return { success: true, user: updatedUser }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // Check if user has permission
  const hasPermission = (requiredRole, resourceAgencyId = null) => {
    if (!user.value) return false

    const roleHierarchy = {
      admin_global: 5,
      admin_agence: 4,
      agent_rh: 3,
      agent_personnel: 2,
      client: 1,
    }

    const userLevel = roleHierarchy[user.value.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0

    // Global admin has access to everything
    if (user.value.role === "admin_global") return true

    // For agency-specific roles, check agency association
    if (resourceAgencyId && user.value.agencyId !== resourceAgencyId) {
      return false
    }

    return userLevel >= requiredLevel
  }

  const canManageResource = (resourceType, resourceAgencyId = null) => {
    if (!user.value) return false

    switch (user.value.role) {
      case "admin_global":
        return true
      case "admin_agence":
        return !resourceAgencyId || user.value.agencyId === resourceAgencyId
      case "agent_rh":
        return (
          (resourceType === "agents" || resourceType === "visits") &&
          (!resourceAgencyId || user.value.agencyId === resourceAgencyId)
        )
      case "agent_personnel":
        return (
          ["logements", "contracts", "visits"].includes(resourceType) &&
          (!resourceAgencyId || user.value.agencyId === resourceAgencyId)
        )
      case "client":
        return ["profile", "visits", "contracts", "reviews"].includes(resourceType)
      default:
        return false
    }
  }

  return {
    // State
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    isAuthenticated,
    userRole,
    isClient,
    isAgentPersonnel,
    isAgentRH,
    isAdminAgence,
    isAdminGlobal,
    // Legacy compatibility
    isAgent,
    isAdmin,

    // Methods
    initAuth,
    login,
    register,
    logout,
    updateProfile,
    hasPermission,
    canManageResource,
  }
}

export default useAuth
