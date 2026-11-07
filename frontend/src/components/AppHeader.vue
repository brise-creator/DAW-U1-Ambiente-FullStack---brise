<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../services/auth.js'

const router = useRouter()

const {
  user,
  authenticated,
  logout
} = useAuth()

// CERRAR SESIÓN
async function cerrarSesion() {
  try {
    await logout()
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }

  await router.push('/login')
}
</script>

<template>
  <header class="header">
    <div class="container">

      <h1>Servicios Web</h1>

      <nav aria-label="Navegación principal">

        <!-- INICIO -->
        <RouterLink to="/">
          Inicio
        </RouterLink>

        <!-- DASHBOARD -->
        <RouterLink
          v-if="authenticated"
          to="/dashboard"
        >
          Dashboard
        </RouterLink>

        <!-- ADMINISTRACIÓN DE USUARIOS -->
        <RouterLink
          v-if="user?.rol === 'ADMIN_SISTEMA'"
          to="/usuarios"
        >
          Usuarios
        </RouterLink>

        <!-- ADMINISTRACIÓN DE SERVICIOS -->
        <RouterLink
          v-if="
            user?.rol === 'ADMIN_SISTEMA' ||
            user?.rol === 'ADMIN_SERVICIOS'
          "
          to="/services/admin"
        >
          Administrar servicios
        </RouterLink>

        <!-- SERVICIOS GENERALES -->
        <RouterLink to="/servicios">
          Servicios
        </RouterLink>

        <!-- INICIAR SESIÓN -->
        <RouterLink
          v-if="!authenticated"
          to="/login"
        >
          Iniciar sesión
        </RouterLink>

        <!-- CERRAR SESIÓN -->
        <button
          v-if="authenticated"
          type="button"
          @click="cerrarSesion"
        >
          Cerrar sesión
        </button>

      </nav>

    </div>
  </header>
</template>