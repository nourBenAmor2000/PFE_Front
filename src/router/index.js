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
import AdminDashboard from "../views/AdminDashboard.vue"
import AddProperty from "../views/AddProperty.vue"
import Agencies from "../views/Agencies.vue"
import AgencyDetail from "../views/AgencyDetail.vue"
import AgentProfile from "../views/AgentProfile.vue"
import Unauthorized from "../views/Unauthorized.vue"
import { setupRouteGuards } from "./guards"
import EditVisitsView from "@/views/Visits/EditVisitsView.vue"
import AddVisitsView from "@/views/Visits/AddVisitsView.vue"
import VisitsView from "@/views/Visits/VisitsView.vue"
import EditSubCategoryView from "../views/SubCategory/EditSubCategoryView.vue"
import AddSubCategoryView from "../views/SubCategory/AddSubCategoryView.vue"
import SubCategoryView from "../views/SubCategory/SubCategoryView.vue"
import EditLogementView from "../views/Logements/EditLogementView.vue"
import AddLogementView from "../views/Logements/AddLogementView.vue"
import LogementView from "../views/Logements/LogementView.vue"
import EditContractView from "../views/Contracts/EditContractView.vue"
import AddContractView from "../views/Contracts/AddContractView.vue"
import ContractsView from "../views/Contracts/ContractsView.vue"
import EditClientView from "../views/Clients/EditClientView.vue"
import AddClientView from "../views/Clients/AddClientView.vue"
import ClientsView from "../views/Clients/ClientsView.vue"
import EditCategoryView from "../views/Category/EditCategoryView.vue"
import AddCategoryView from "../views/Category/AddCategoryView.vue"
import CategoryView from "../views/Category/CategoryView.vue"
import AddAgentView from "../views/Agents/AddAgentView.vue"
import AgentsView from "../views/Agents/AgentsView.vue"
import EditAgenciesView from "../views/Agencies/EditAgenciesView.vue"
import AddAgenciesView from "../views/Agencies/AddAgenciesView.vue"
import AgenciesView from "../views/Agencies/AgenciesView.vue"
import EditAdminView from "../views/Admin/EditAdminView.vue"
import AddAdminView from "../views/Admin/AddAdminView.vue"
import AdminView from "../views/Admin/AdminView.vue"
import EditAgentView from "@/views/Agents/EditAgentView.vue"
import AttributesView from "@/views/Attributes/AttributesView.vue"
import AddAttributeView from "@/views/Attributes/AddAttributeView.vue"
import EditAttributeView from "@/views/Attributes/EditAttributeView.vue"
import ReviewsView from "@/views/Reviews/ReviewsView.vue"
import AddReviewView from "@/views/Reviews/AddReviewView.vue"
import EditReviewView from "@/views/Reviews/EditReviewView.vue"
import PaymentContractsView from "@/views/PaymentContracts/PaymentContractsView.vue"
import AddPaymentContractView from "@/views/PaymentContracts/AddPaymentContractView.vue"
import EditPaymentContractView from "@/views/PaymentContracts/EditPaymentContractView.vue"








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
  // ===== ADMIN CRUD ROUTES =====
{
  path: "/admin/admins",
  name: "AdminView",
  component: AdminView,
  meta: { requiresAuth: true, requiredRole: "admin_global" },
},
{
  path: "/admin/admins/add",
  name: "AddAdminView",
  component: AddAdminView,
  meta: { requiresAuth: true, requiredRole: "admin_global" },
},
{
  path: "/admin/admins/edit/:id",
  name: "EditAdminView",
  component: EditAdminView,
  meta: { requiresAuth: true, requiredRole: "admin_global" },
  props: true,
},

// ===== AGENCIES CRUD ROUTES =====
{
  path: "/admin/agencies",
  name: "AgenciesView",
  component: AgenciesView,
  meta: { requiresAuth: true, requiredRole: "admin_global" },
},
{
  path: "/admin/agencies/add",
  name: "AddAgenciesView",
  component: AddAgenciesView,
  meta: { requiresAuth: true, requiredRole: "admin_global" },
},
{
  path: "/admin/agencies/edit/:id",
  name: "EditAgenciesView",
  component: EditAgenciesView,
  meta: { requiresAuth: true, requiredRole: "admin_global" },
  props: true,
},

// ===== AGENTS CRUD ROUTES =====
{
  path: "/admin/agents",
  name: "AgentsView",
  component: AgentsView,
  meta: { requiresAuth: true, requiredRole: "admin_global" },
},
{
  path: "/admin/agents/add",
  name: "AddAgentView",
  component: () => AddAgentView,
  meta: { requiresAuth: true, requiredRole: "admin_global" },
},
{
  path: "/admin/agents/edit/:id",
  name: "EditAgentView",
  component: EditAgentView,
  meta: { requiresAuth: true, requiredRole: "admin_global" },
  props: true,
},

// ===== CATEGORY CRUD ROUTES =====
{
  path: "/admin/categories",
  name: "CategoryView",
  component: CategoryView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/categories/add",
  name: "AddCategoryView",
  component: AddCategoryView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/categories/edit/:id",
  name: "EditCategoryView",
  component: EditCategoryView,
  meta: { requiresAuth: true, requiredRole: "admin" },
  props: true,
},

// ===== CLIENTS CRUD ROUTES =====
{
  path: "/admin/clients",
  name: "ClientsView",
  component: ClientsView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/clients/add",
  name: "AddClientView",
  component: AddClientView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/clients/edit/:id",
  name: "EditClientView",
  component: EditClientView,
  meta: { requiresAuth: true, requiredRole: "admin" },
  props: true,
},

// ===== CONTRACTS CRUD ROUTES =====
{
  path: "/admin/contracts",
  name: "ContractsView",
  component: ContractsView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/contracts/add",
  name: "AddContractView",
  component: AddContractView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/contracts/edit/:id",
  name: "EditContractView",
  component: EditContractView,
  meta: { requiresAuth: true, requiredRole: "admin" },
  props: true,
},

// ===== LOGEMENTS CRUD ROUTES =====
{
  path: "/admin/logements",
  name: "LogementView",
  component: LogementView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/logements/add",
  name: "AddLogementView",
  component: () => AddLogementView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/logements/edit/:id",
  name: "EditLogementView",
  component: () => EditLogementView,
  meta: { requiresAuth: true, requiredRole: "admin" },
  props: true,
},

// ===== SUBCATEGORY CRUD ROUTES =====
{
  path: "/admin/subcategories",
  name: "SubCategoryView",
  component: () => SubCategoryView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/subcategories/add",
  name: "AddSubCategoryView",
  component: () => AddSubCategoryView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/subcategories/edit/:id",
  name: "EditSubCategoryView",
  component: EditSubCategoryView,
  meta: { requiresAuth: true, requiredRole: "admin" },
  props: true,
},

// ===== VISITS CRUD ROUTES =====
{
  path: "/admin/visits",
  name: "VisitsView",
  component: VisitsView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/visits/add",
  name: "AddVisitsView",
  component: AddVisitsView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/visits/edit/:id",
  name: "EditVisitsView",
  component:  EditVisitsView,
  meta: { requiresAuth: true, requiredRole: "admin" },
  props: true,
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

// ===== ATTRIBUTES CRUD ROUTES =====
{
  path: "/admin/attributes",
  name: "AttributesView",
  component: AttributesView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/attributes/add",
  name: "AddAttributeView",
  component: AddAttributeView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/attributes/edit/:id",
  name: "EditAttributeView",
  component: EditAttributeView,
  meta: { requiresAuth: true, requiredRole: "admin" },
  props: true,
},

// ===== REVIEWS CRUD ROUTES =====
{
  path: "/admin/reviews",
  name: "ReviewsView",
  component: ReviewsView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/reviews/add",
  name: "AddReviewView",
  component: AddReviewView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/reviews/edit/:id",
  name: "EditReviewView",
  component: EditReviewView,
  meta: { requiresAuth: true, requiredRole: "admin" },
  props: true,
},

// ===== PAYMENT CONTRACTS CRUD ROUTES =====
{
  path: "/admin/payment-contracts",
  name: "PaymentContractsView",
  component: PaymentContractsView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/payment-contracts/add",
  name: "AddPaymentContractView",
  component: AddPaymentContractView,
  meta: { requiresAuth: true, requiredRole: "admin" },
},
{
  path: "/admin/payment-contracts/edit/:id",
  name: "EditPaymentContractView",
  component: EditPaymentContractView,
  meta: { requiresAuth: true, requiredRole: "admin" },
  props: true,
},
 {
  path: "/forgot-password",
  name: "ForgotPassword",
  component: () => import("../views/ForgotPassword.vue"),
  meta: { requiresAuth: false }, // ✅ accessible sans login
},

{
  path: "/reset-password",
  name: "ResetPassword",
  component: () => import("../views/ResetPassword.vue"),
  meta: { requiresAuth: false }, // accessible sans login
},


  {
  path: '/verify-email',
  name: 'verify-email-code',
  component: () => import('@/views/VerifyEmailCode.vue'),
}


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
