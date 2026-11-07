<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import { useAuth } from '../services/auth'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()
const loading = ref(false)
const error = ref('')

async function handleLogin(credentials) {
  loading.value = true
  error.value = ''

  try {
    await login(credentials)
    const destino = route.query.redirect || '/dashboard'
    router.push(destino)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login-page">
    <div class="login-intro">
      <p class="home-eyebrow">Qué gusto verte de nuevo</p>
      <h1>Tu espacio de trabajo te espera.</h1>
      <p>
        Inicia sesión para consultar tu panel y acceder a las herramientas de
        tu cuenta.
      </p>
    </div>

    <LoginForm
      :loading="loading"
      :error="error"
      @submit="handleLogin"
    />
  </section>
</template>