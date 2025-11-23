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

  const extractAuthPayload = (data) => {
    const t =
      data?.token ||
      data?.access_token ||
      data?.jwt ||
      data?.data?.token ||
      null

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
      if (!u.name && u.username) u.name = u.username
      user.value = u
      localStorage.setItem("user", JSON.stringify(u))
    }
  }

  // -------- LOGIN --------
  const login = async (credentials, type = "client") => {
    isLoading.value = true
    try {
      const endpoint = "/unified/login"
      const { data } = await api.post(endpoint, credentials)
      const payload = extractAuthPayload(data)
      if (!payload.t && !payload.u) throw new Error("Unexpected login response format")
      if (!payload.u && payload.t) {
        api.defaults.headers.Authorization = `Bearer ${payload.t}`
        payload.u = await fetchMe("admin")
      }

      if (payload.u && !payload.u.role) {
        payload.u.role = type === "agent" ? "agent_personnel" : "client"
      }

      persistAuth(payload)
      return { success: true, user: user.value, token: token.value }
    } catch (error) {
      return {
        success: false,
        error:
          (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          "Login failed",
      }
    } finally {
      isLoading.value = false
    }
  }

  // -------- REGISTER (client / agent / admin) --------
 // useAuth.js

const register = async (userData, type = 'client') => {
  isLoading.value = true

  try {
    const normalizedType = String(type || 'client').trim().toLowerCase()

    let endpoint = '/client/register'
    let payloadToSend = {}

    if (normalizedType === 'agent') {
      endpoint = '/agent/register'
      payloadToSend = {
        name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation || userData.password,
        phone: userData.phone || null,
        agency_id: userData.agency_id,
        role: userData.agent_role || 'agent', // à adapter à tes constantes
      }
    } else {
      // client
      endpoint = '/client/register'
      payloadToSend = {
        name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation || userData.password,
        phone: userData.phone || null,
      }
    }

    const { data } = await api.post(endpoint, payloadToSend)

    return {
      success: data && (data.success === true || data.success === undefined),
      message: data?.message || 'Inscription réussie. Vérifiez votre email.',
      userType: normalizedType,
      email: userData.email,
      data,
    }
  } catch (error) {
    let errorMessage = 'Registration failed'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.errors) {
      const firstError = Object.values(error.response.data.errors)[0]
      errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
    } else if (error.message) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  } finally {
    isLoading.value = false
  }
}


  // Send password reset email: requestPasswordEmail(email, "client" | "agent" | "admin")
const requestPasswordEmail = async (email, type = "client") => {
  isLoading.value = true
  try {
    let endpoint = "/client/password/email"
    if (type === "agent") endpoint = "/agent/password/email"
    if (type === "admin") endpoint = "/admin/password/email"

    const { data } = await api.post(endpoint, { email })

    const message =
      data?.message ||
      data?.status ||
      "Si un compte existe avec cette adresse, un lien de réinitialisation a été envoyé."

    return {
      success: true,
      message,
      data,
    }
  } catch (error) {
    console.error("Forgot password error:", error?.response?.status, error?.response?.data)
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Échec de l'envoi de l'email de réinitialisation.",
    }
  } finally {
    isLoading.value = false
  }
}



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
        error:
          (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          "Profile update failed",
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
    router.push("/")
  }

  const hasPermission = (requiredRole, resourceAgencyId = null) => {
    if (!user.value) return false

    const normalizeRole = (role) => {
      if (!role) return null
      const r = String(role).toLowerCase().trim()
      if (r === "admin_agent") return "admin_agence"
      if (r === "agent_personnnel") return "agent_personnel"
      return r
    }

    const uRole = normalizeRole(user.value.role)
    const reqRole = normalizeRole(requiredRole)

    if (reqRole === "admin") {
      return uRole === "admin_global" || uRole === "admin_agence"
    }

    const roleHierarchy = {
      admin_global: 5,
      admin_agence: 4,
      agent_rh: 3,
      agent_personnel: 2,
      client: 1,
    }

    const userLevel = roleHierarchy[uRole] || 0
    const requiredLevel = roleHierarchy[reqRole] || 0

    if (uRole === "admin_global") return true

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
    initAuth,
    login,
    register,
    requestPasswordEmail,
    updateProfile,
    logout,
    hasPermission,
    canManageResource,
  }
}

export default useAuth
