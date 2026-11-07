import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ServicesView from '../views/ServicesView.vue'

// IMPORTAR AUTENTICACIÓN EXISTENTE
import { useAuth } from '../services/auth.js'

// OBTENER DATOS DE AUTENTICACIÓN
const {
  user,
  authenticated,
  initialized,
  checkSession
} = useAuth()


// ======================================
// RUTAS DEL SISTEMA
// ======================================

const routes = [

  // PÁGINA PRINCIPAL
  {
    path: '/',
    name: 'inicio',
    component: HomeView
  },

  // INICIO DE SESIÓN
  {
    path: '/login',
    name: 'login',
    component: () =>
      import('../views/LoginView.vue')
  },

  // DASHBOARD
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () =>
      import('../views/DashboardView.vue'),

    meta: {
      requiresAuth: true
    }
  },

  // SERVICIOS GENERALES
  {
    path: '/servicios',
    name: 'servicios',
    component: ServicesView
  },

  // ADMINISTRACIÓN DE USUARIOS
  {
    path: '/usuarios',
    name: 'usuarios',

    component: () =>
      import('../views/usuarios/UsersView.vue'),

    meta: {
      requiresAuth: true,
      roles: ['ADMIN_SISTEMA']
    }
  },

  // ADMINISTRACIÓN DE SERVICIOS
  {
    path: '/services/admin',
    name: 'servicios-admin',

    component: () =>
      import('../views/services/ServicesAdminView.vue'),

    meta: {
      requiresAuth: true,
      roles: [
        'ADMIN_SISTEMA',
        'ADMIN_SERVICIOS'
      ]
    }
  }

]


// ======================================
// CREAR ROUTER
// ======================================

const router = createRouter({
  history: createWebHistory(),
  routes
})


// ======================================
// PROTECCIÓN DE RUTAS
// ======================================

router.beforeEach(async (to) => {

  // VERIFICAR SESIÓN SI NO SE HA INICIALIZADO
  if (!initialized.value) {
    await checkSession()
  }

  // COMPROBAR SI LA RUTA NECESITA LOGIN
  if (to.meta.requiresAuth) {

    // SI NO ESTÁ AUTENTICADO
    if (!authenticated.value) {

      return {
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      }

    }

    // OBTENER ROLES PERMITIDOS
    const requiredRoles = to.meta.roles

    // VERIFICAR PERMISOS
    if (
      Array.isArray(requiredRoles) &&
      requiredRoles.length > 0 &&
      !requiredRoles.includes(user.value?.rol)
    ) {

      // USUARIO SIN PERMISOS
      return {
        name: 'dashboard'
      }

    }

  }

  // PERMITIR NAVEGACIÓN
  return true

})


// ======================================
// EXPORTAR ROUTER
// ======================================

export default router