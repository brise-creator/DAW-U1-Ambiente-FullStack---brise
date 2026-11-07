<script setup>
import { onMounted, reactive, ref } from 'vue'
import DataGrid from '../../components/DataGrid.vue'
import {
  actualizarServicio,
  cambiarEstadoServicio,
  crearServicio,
  listarServicios
} from '../../services/servicesApi.js'

const servicios = ref([])
const modal = ref(false)
const editando = ref(null)
const error = ref('')
const cargando = ref(false)
const form = reactive({
  nombre: '',
  descripcion: '',
  precio: 0,
  duracion_minutos: 60,
  activo: 1
})

const columns = [
  { key: 'nombre', label: 'Servicio' },
  { key: 'descripcion', label: 'Descripción' },
  {
    key: 'precio',
    label: 'Precio',
    formatter: value =>
      `$${Number(value).toLocaleString('es-MX', {
        minimumFractionDigits: 2
      })}`
  },
  {
    key: 'duracion_minutos',
    label: 'Duración',
    formatter: value => `${value} min`
  },
  {
    key: 'activo',
    label: 'Estado',
    formatter: value => (Number(value) === 1 ? 'Activo' : 'Inactivo')
  },
  { key: 'actions', label: 'Acciones', searchable: false, export: false }
]

async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    servicios.value = await listarServicios()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function nuevo() {
  editando.value = null
  Object.assign(form, {
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion_minutos: 60,
    activo: 1
  })
  error.value = ''
  modal.value = true
}

function editar(servicio) {
  editando.value = servicio.id
  Object.assign(form, {
    nombre: servicio.nombre,
    descripcion: servicio.descripcion,
    precio: Number(servicio.precio),
    duracion_minutos: Number(servicio.duracion_minutos),
    activo: Number(servicio.activo)
  })
  error.value = ''
  modal.value = true
}

async function guardar() {
  error.value = ''
  try {
    if (editando.value !== null) {
      await actualizarServicio(editando.value, form)
    } else {
      await crearServicio(form)
    }
    modal.value = false
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

async function cambiarEstado(servicio) {
  error.value = ''
  try {
    const nuevoEstado = Number(servicio.activo) === 1 ? 0 : 1
    await cambiarEstadoServicio(servicio.id, nuevoEstado)
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

onMounted(() => {
  cargar()
})
</script>

<template>
  <section class="admin-page">
    <header class="page-header">
      <div>
        <span class="page-tag">Administración</span>
        <h1>Servicios</h1>
        <p>Administra los servicios, sus precios y estados.</p>
      </div>
      <button class="btn btn-primary" type="button" @click="nuevo">
        + Nuevo servicio
      </button>
    </header>

    <p v-if="error && !modal" class="form-message error" role="alert">
      {{ error }}
    </p>
    <p v-if="cargando" aria-live="polite">
      Cargando servicios...
    </p>

    <DataGrid
      :rows="servicios"
      :columns="columns"
      title="Reporte de Servicios"
      file-name="servicios"
    >
      <template #actions="{ row }">
        <div class="row-actions">
          <button class="action-edit" type="button" @click="editar(row)">
            Editar
          </button>
          <button
            class="action-status"
            type="button"
            @click="cambiarEstado(row)"
          >
            {{ Number(row.activo) === 1 ? 'Inactivar' : 'Activar' }}
          </button>
        </div>
      </template>
    </DataGrid>

    <div v-if="modal" class="modal-backdrop">
      <div class="modal-card">
        <h2>{{ editando !== null ? 'Editar servicio' : 'Nuevo servicio' }}</h2>
        <form class="crud-form" @submit.prevent="guardar">
          <label>
            Nombre
            <input v-model.trim="form.nombre" maxlength="120" required>
          </label>
          <label>
            Precio
            <input
              v-model.number="form.precio"
              type="number"
              min="0"
              step="0.01"
              required
            >
          </label>
          <label class="full-width">
            Descripción
            <textarea v-model.trim="form.descripcion" required></textarea>
          </label>
          <label>
            Duración (minutos)
            <input
              v-model.number="form.duracion_minutos"
              type="number"
              min="1"
              step="1"
              required
            >
          </label>
          <label>
            Estado
            <select v-model.number="form.activo">
              <option :value="1">Activo</option>
              <option :value="0">Inactivo</option>
            </select>
          </label>
          <p v-if="error" class="form-message error full-width" role="alert">
            {{ error }}
          </p>
          <div class="modal-actions">
            <button type="button" @click="modal = false">
              Cancelar
            </button>
            <button class="btn btn-primary" type="submit">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
