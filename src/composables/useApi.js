import axios from 'axios'

const API_BASE = (import.meta.env.VITE_BACKEND_URL && import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '')) || 'http://localhost:8000/api'

// Create axios instance with auth interceptor (singleton)
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false, // Enable credentials for CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Get the appropriate API endpoint based on user role
 */
function getEndpoint(resource, useModuleRoute = false) {
  // Module routes (direct API routes) - always use for visits, contracts, reviews
  // These resources have routes at module level that support all auth types
  if (useModuleRoute || ['visits', 'contracts', 'reviews'].includes(resource)) {
    return `/${resource}`
  }
  
  // Get user from localStorage
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const userRole = user?.role
  
  // Admin routes - admin_agence uses direct routes from Agency module, not admin routes
  if (userRole === 'admin_global') {
    return `/admin/${resource}`
  }
  
  // Admin agence uses direct routes (defined in Agency module)
  // For agents, agencies, and visits, use direct routes
  if (userRole === 'admin_agence') {
    if (['agents', 'agency', 'agencies', 'visits'].includes(resource)) {
      return `/${resource}`
    }
    // For other resources, fall back to admin routes if needed
    return `/admin/${resource}`
  }
  
  // Agent routes (for resources that don't have module routes)
  if (userRole === 'agent_personnel' || userRole === 'agent_rh') {
    return `/agent/${resource}`
  }
  
  // Client routes - use direct module routes for all resources
  if (userRole === 'client' || userRole === 'Client') {
    return `/${resource}`
  }
  
  // Default to direct route (module route)
  return `/${resource}`
}

/**
 * Extract data from API response (handles different response formats)
 */
function extractData(response) {
  // Handle different response formats
  if (response.data?.data !== undefined) {
    return response.data.data
  }
  if (response.data?.success && response.data?.visits) {
    return response.data.visits
  }
  if (response.data?.success && response.data?.logements) {
    return response.data.logements
  }
  if (response.data?.success && response.data?.contracts) {
    return response.data.contracts
  }
  if (response.data?.success && response.data?.categories) {
    return response.data.categories
  }
  if (response.data?.success && response.data?.subcategories) {
    return response.data.subcategories
  }
  if (response.data?.success && response.data?.attributes) {
    return response.data.attributes
  }
  if (response.data?.success && response.data?.reviews) {
    return response.data.reviews
  }
  if (response.data?.success && response.data?.agents) {
    return response.data.agents
  }
  if (response.data?.success && response.data?.agent) {
    return response.data.agent
  }
  if (response.data?.success && response.data?.payments) {
    return response.data.payments
  }
  if (response.data?.success && response.data?.payment) {
    return response.data.payment
  }
  if (response.data?.success && response.data?.attribute) {
    return response.data.attribute
  }
  if (response.data?.success && response.data?.review) {
    return response.data.review
  }
  if (Array.isArray(response.data)) {
    return response.data
  }
  return response.data
}

/**
 * Centralized API client that automatically includes authentication token
 */
export function useApi() {
  return {
    api,
    getEndpoint,
    extractData,
  }
}

