import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import Properties from "../views/Properties.vue"
import PropertyDetail from "../views/PropertyDetail.vue"
import Agents from "../views/Agents.vue"
import AgentDetail from "../views/AgentDetail.vue"
import Cities from "../views/Cities.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Dashboard from "../views/Dashboard.vue"
import AddProperty from "../views/AddProperty.vue"
import Agencies from "../views/Agencies.vue"
import AgencyDetail from "../views/AgencyDetail.vue"
import AgentProfile from "../views/AgentProfile.vue"
import Unauthorized from "../views/Unauthorized.vue"
import { setupRouteGuards } from "./guards"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/properties",
    name: "Properties",
    component: Properties,
  },
  {
    path: "/properties/:id",
    name: "PropertyDetail",
    component: PropertyDetail,
    props: true,
  },
  {
    path: "/agents",
    name: "Agents",
    component: Agents,
  },
  {
    path: "/agents/:id",
    name: "AgentDetail",
    component: AgentDetail,
    props: true,
  },
  {
    path: "/agencies",
    name: "Agencies",
    component: Agencies,
  },
  {
    path: "/agencies/:id",
    name: "AgencyDetail",
    component: AgencyDetail,
    props: true,
  },
  {
    path: "/agent-profile",
    name: "AgentProfile",
    component: AgentProfile,
    meta: { requiresAuth: true, requiredRole: "agent_personnel" },
  },
  {
    path: "/cities",
    name: "Cities",
    component: Cities,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/add-property",
    name: "AddProperty",
    component: AddProperty,
    meta: { requiresAuth: true, requiredRole: "agent_personnel" },
  },
  {
    path: "/unauthorized",
    name: "Unauthorized",
    component: Unauthorized,
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/my-visits",
    name: "MyVisits",
    component: () => import("../views/MyVisits.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/my-contracts",
    name: "MyContracts",
    component: () => import("../views/MyContracts.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: () => import("../views/AdminDashboard.vue"),
    meta: { requiresAuth: true, requiredRole: "admin" },
  },
  {
    path: "/admin-global",
    name: "AdminGlobalDashboard",
    component: () => import("../views/AdminGlobalDashboard.vue"),
    meta: { requiresAuth: true, requiredRole: "admin_global" },
  },
  {
    path: "/admin-agence",
    name: "AdminAgenceDashboard",
    component: () => import("../views/AdminAgenceDashboard.vue"),
    meta: { requiresAuth: true, requiredRole: "admin_agence" },
  },
  {
    path: "/agent-rh",
    name: "AgentRHDashboard",
    component: () => import("../views/AgentRHDashboard.vue"),
    meta: { requiresAuth: true, requiredRole: "agent_rh" },
  },
  {
    path: "/agent-personnel",
    name: "AgentPersonnelDashboard",
    component: () => import("../views/AgentPersonnelDashboard.vue"),
    meta: { requiresAuth: true, requiredRole: "agent_personnel" },
  },
  {
    path: "/manage-agencies",
    name: "ManageAgencies",
    component: () => import("../views/ManageAgencies.vue"),
    meta: { requiresAuth: true, requiredRole: "admin_global" },
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

setupRouteGuards(router)

export default router
