import { apiFetch } from './https.js'

export async function listarServicios() {
  const response = await apiFetch('/api/servicios/')

  if (!Array.isArray(response.data)) {
    throw new Error('El servidor no devolvió una lista válida de servicios.')
  }

  return response.data
}

export function crearServicio(data) {
  return apiFetch('/api/servicios/store.php', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function actualizarServicio(id, data) {
  return apiFetch(`/api/servicios/update.php?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export function cambiarEstadoServicio(id, activo) {
  return apiFetch(`/api/servicios/status.php?id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ activo })
  })
}