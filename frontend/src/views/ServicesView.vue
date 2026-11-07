<script setup>
import { computed, onMounted, ref } from 'vue'
import ServiceCard from '../components/ServiceCard.vue'
import { listarServicios } from '../services/servicesApi.js'

const servicios = ref([])
const busqueda = ref('')
const cargando = ref(true)
const error = ref('')

const serviciosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase()

  return servicios.value.filter(servicio =>
    servicio.nombre.toLowerCase().includes(texto)
  )
})

async function cargarServicios() {
  cargando.value = true
  error.value = ''

  try {
    servicios.value = await listarServicios()
  } catch (e) {
    error.value = e instanceof Error
      ? e.message
      : 'No fue posible cargar los servicios.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarServicios)
</script>

<template>
  <section>
    <header class="section-header">
      <div>
        <h2>Servicios disponibles</h2>

        <p>
          Consulta los servicios disponibles.
        </p>
      </div>

      <label>
        Buscar servicio

        <input
          v-model="busqueda"
          type="search"
          placeholder="Ej. desarrollo web"
        >
      </label>
    </header>

    <p
      v-if="cargando"
      aria-live="polite"
    >
      Cargando información...
    </p>

    <p
      v-else-if="error"
      role="alert"
    >
      {{ error }}
      <button
        type="button"
        @click="cargarServicios"
      >
        Reintentar
      </button>
    </p>

    <p
      v-else-if="serviciosFiltrados.length === 0"
    >
      No existen servicios que coincidan con la búsqueda.
    </p>

    <div
      v-else
      class="services-grid"
    >
      <ServiceCard
        v-for="servicio in serviciosFiltrados"
        :key="servicio.id"
        :servicio="servicio"
      />
    </div>
  </section>
</template>