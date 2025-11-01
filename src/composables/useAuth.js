"use client"

import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

// ---- Axios base ----
const API_BASE =
  (import.meta.env.VITE_BACKEND_URL && import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")) ||
  "http://localhost:8000/api"

const token = ref(null)
const user = ref(null)
const isLoading = ref(false)

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
})

// attach token if present
api.interceptors.request.use((cfg) => {
  const t = token.value || localStorage.getItem("token")
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

// optional: auto-logout on 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      token.value = null
      user.value = null
    }
    return Promise.reject(err)
  }
)

export function useAuth() {
  const router = useRouter()

  // computed roles
  
  const isAuthenticated = computed(() => !!(user.value || localStorage.getItem("token")))
  const userRole = computed(() => (user.value && user.value.role) || null)
  const isAgentPersonnel = computed(() => userRole.value === "agent_personnel")
  const isAgentRH = computed(() => userRole.value === "agent_rh")
  const isAdminAgence = computed(() => userRole.value === "admin_agence")
  const isAdminGlobal = computed(() => userRole.value === "admin_global")
  const isAgent = computed(
    () =>
      userRole.value === "agent_personnel" ||
      userRole.value === "agent_rh" ||
      userRole.value === "admin_agence"
  )
  const isAdmin = computed(
    () => userRole.value === "admin_agence" || userRole.value === "admin_global"
  )
  const isClient = computed(() => userRole.value === "client")

  // Initialize from localStorage
  const initAuth = () => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    if (storedToken) token.value = storedToken
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error("Error parsing stored user:", e)
        localStorage.removeItem("user")
      }
    }
  }

  // Helpers to normalize API responses
  const extractAuthPayload = (data) => {
    // token: token | access_token | jwt | data.token
    const t =
      data?.token ||
      data?.access_token ||
      data?.jwt ||
      data?.data?.token ||
      null
    // user: client | user | agent | data (si data = user)
    const u =
      data?.client ||
      data?.user ||
      data?.agent ||
      data?.data ||
      null
    return { t, u }
  }

  function persistAuth({ t, u }) {
  if (t) {
    token.value = t
    localStorage.setItem("token", t)
  }
  if (u) {
    // 🔧 normalisation
    if (!u.name && u.username) u.name = u.username
    user.value = u
    localStorage.setItem("user", JSON.stringify(u))
  }
}


  // -------- AUTH CALLS --------

  // Login: credentials = { email, password }, type = "client" | "agent"
  const login = async (credentials, type = "client") => {
    isLoading.value = true
    try {
      const endpoint = type === "agent" ? "/agent/login" : "/admin/login"
      const { data } = await api.post(endpoint, credentials)
      const payload = extractAuthPayload(data)
      if (!payload.t && !payload.u) throw new Error("Unexpected login response format")
if (!payload.u && payload.t) {
  api.defaults.headers.Authorization = `Bearer ${payload.t}`
  payload.u = await fetchMe('admin') // /client/me
}

      // If backend doesn’t return role, infer a default
      if (payload.u && !payload.u.role) {
        payload.u.role = type === "agent" ? "agent_personnel" : "client"
      }
       console.log('my user ',user.value);
      persistAuth(payload)
      return { success: true, user: user.value, token: token.value }
    } catch (error) {
      return {
        success: false,
        error: (error && error.response && error.response.data && error.response.data.message) || error.message || "Login failed",
      }
    } finally {
      isLoading.value = false
    }
  }

  // Register (client only). userData must match your backend fields.
  const register = async (userData) => {
    isLoading.value = true
    try {
      const { data } = await api.post("/client/register", userData)
      // some APIs auto-login; if not, just return success
      const payload = extractAuthPayload(data)
      if (payload.t || payload.u) {
        if (payload.u && !payload.u.role) payload.u.role = "client"
        persistAuth(payload)
      }
      return { success: true, user: user.value || null, token: token.value || null }
    } catch (error) {
      return {
        success: false,
        error: (error && error.response && error.response.data && error.response.data.message) || error.message || "Registration failed",
      }
    } finally {
      isLoading.value = false
    }
  }

  // Send password reset email: requestPasswordEmail(email, "client"|"agent")
  const requestPasswordEmail = async (email, type) => {
    isLoading.value = true
    try {
      const endpoint = type === "agent" ? "/agent/password/email" : "/client/password/email"
      const { data } = await api.post(endpoint, { email })
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: (error && error.response && error.response.data && error.response.data.message) || error.message || "Failed to send password email",
      }
    } finally {
      isLoading.value = false
    }
  }

  // Update profile: updateProfile(payload, "client"|"agent")
  const updateProfile = async (updates, type) => {
    if (!token.value) return { success: false, error: "Not authenticated" }
    isLoading.value = true
    try {
      const endpoint = type === "agent" ? "/agent/profile/update" : "/client/profile/update"
      const { data } = await api.put(endpoint, updates)
      const updated = (data && (data.user || data.data)) || data || updates
      const merged = Object.assign({}, user.value || {}, updated || {})
      user.value = merged
      localStorage.setItem("user", JSON.stringify(merged))
      return { success: true, user: merged }
    } catch (error) {
      return {
        success: false,
        error: (error && error.response && error.response.data && error.response.data.message) || error.message || "Profile update failed",
      }
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchMe = async (type = "client") => {
  const endpoint = type === "agent" ? "/agent/me" : "/admin/me"
  const { data } = await api.get(endpoint)
  return data.client || data.user || data.agent || data.data || data
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  // ---- Permissions (kept as-is) ----
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
    if (user.value.role === "admin_global") return true
    if (resourceAgencyId && user.value.agencyId !== resourceAgencyId) return false
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
    // state
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    isAuthenticated,
    userRole,
    isClient,
    isAgentPersonnel,
    isAgentRH,
    isAdminAgence,
    isAdminGlobal,
    isAgent,
    isAdmin,
    // methods
    initAuth,
    login,                // login({ email, password }, "client" | "agent")
    register,             // client register
    requestPasswordEmail, // requestPasswordEmail(email, "client" | "agent")
    updateProfile,        // updateProfile(payload, "client" | "agent")
    logout,
    hasPermission,
    canManageResource,
  }
  
}

export default useAuth
