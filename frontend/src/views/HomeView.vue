<script setup>
import { useAuth } from '../services/auth.js'

const { authenticated } = useAuth()
</script>

<template>
  <section class="home">
    <div class="home-copy">
      <p class="home-eyebrow">Servicios Web</p>
      <h2>
        Soluciones digitales
        <span>para avanzar.</span>
      </h2>
      <p>
        Explora nuestro catálogo de servicios tecnológicos y encuentra el apoyo
        que necesitas para llevar tus proyectos al siguiente nivel.
      </p>
      <div class="home-actions">
        <RouterLink to="/servicios" class="home-button primary">
          Explorar servicios
          <span aria-hidden="true">&nbsp;→</span>
        </RouterLink>
        <RouterLink
          v-if="!authenticated"
          to="/login"
          class="home-button secondary"
        >
          Iniciar sesión
        </RouterLink>
        <RouterLink
          v-else
          to="/dashboard"
          class="home-button secondary"
        >
          Ir a mi panel
        </RouterLink>
      </div>
    </div>

    <div class="home-art" aria-hidden="true">
      <article class="home-art-card">
        <span class="home-art-label">Tu próximo proyecto</span>
        <h3>Ideas que se convierten en resultados.</h3>
        <p>Un equipo listo para ayudarte a crecer.</p>
        <div class="home-art-line"></div>
        <div class="home-art-line short"></div>
        <div class="home-art-footer">
          <span class="home-art-dot"></span>
          <span>Servicios disponibles</span>
        </div>
      </article>
    </div>
  </section>
</template>