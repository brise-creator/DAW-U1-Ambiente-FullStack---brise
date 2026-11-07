<script setup>
import { onMounted, reactive, ref } from 'vue'
import DataGrid from '../../components/DataGrid.vue'
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario
} from '../../services/userApi.js'
const usuarios = ref([])
const modal = ref(false)
const editando = ref(null)
const error = ref('')
const cargando = ref(false)
const form =reactive({ usuario: '', nombre: '', email: '', password: '', rol: 'CLIENTE', activo:
1 })
const columns = [
{
key: 'usuario',
label: 'Usuario'
},
{
key: 'nombre',
label: 'Nombre'
},
{

key: 'email',
label: 'Correo'
},
{
key: 'rol',
label: 'Rol',
formatter: value => {
const roles = {
ADMIN_SISTEMA: 'Administrador Sistema',
ADMIN_SERVICIOS: 'Administrador Servicios',
CLIENTE: 'Cliente'
}
return roles[value]
}
},
{
key: 'activo',
label: 'Estado',
formatter:
value => Number(value) === 1
? 'Activo'
: 'Inactivo'
},
{
key: 'actions',
label: 'Acciones',
searchable: false,
export: false
}
]
async function cargar() {
  cargando.value = true
  error.value = ''
  try {
    usuarios.value = await listarUsuarios()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}
function nuevo() {
editando.value = null
Object.assign(
form,
{
usuario: '',
nombre: '',
email: '',
password: '',
rol: 'CLIENTE',
activo: 1
}
)
modal.value = true
}
function editar(usuario) {
editando.value = usuario.id
Object.assign(
form,
{
usuario:

usuario.usuario,
nombre:
usuario.nombre,
email:
usuario.email,
password: '',
rol:
usuario.rol,
activo:
Number(usuario.activo)
}
)
modal.value = true
}
async function guardar() {
error.value = ''
try {
if (editando.value) {
await actualizarUsuario( editando.value, form)
} else {
await crearUsuario(form)
}
modal.value = false
await cargar()
} catch (e) {
error.value = e.message
}
}
async function cambiarEstado(usuario) {
  error.value = ''
  try {
    const nuevoEstado = Number(usuario.activo) === 1 ? 0 : 1
    await cambiarEstadoUsuario(usuario.id, nuevoEstado)
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
<span class="page-tag">
Administración
</span>
<h1> Usuarios </h1>
<p>
Administra usuarios, roles y estados.
</p>
</div>
<button class="btn btn-primary" @click="nuevo">
+ Nuevo usuario
</button>

</header>

<p v-if="error" class="form-message error" role="alert">
{{ error }}
</p>
<p v-if="cargando" aria-live="polite">
Cargando usuarios...
</p>
<DataGrid :rows="usuarios" :columns="columns" title="Reporte de Usuarios" file-name="usuarios" >

<template #actions="{ row }" >
<div class="row-actions">
<button class="action-edit" @click="editar(row)" >
Editar
</button>
<button class="action-status" @click=" cambiarEstado(row) " >
{{
Number(row.activo) === 1
? 'Inactivar'
: 'Activar'
}}
</button>
</div>
</template>
</DataGrid>
<div v-if="modal" class="modal-backdrop" >
<div class="modal-card">
<h2>
{{
editando
? 'Editar usuario'
: 'Nuevo usuario'
}}
</h2>
<form class="crud-form" @submit.prevent="guardar">
<label>
Usuario
<input v-model="form.usuario" required>
</label>
<label>
Nombre
<input v-model="form.nombre" required >
</label>
<label>
Correo
<input v-model="form.email" type="email" required>
</label>
<label>
Contraseña
<input v-model="form.password" type="password" :required="!editando" >
</label>
<label>
Rol
<select v-model="form.rol" >
<option value="ADMIN_SISTEMA" >
Administrador del sistema
</option>
<option value="ADMIN_SERVICIOS" >
Administrador de servicios
</option>
<option value="CLIENTE">

Usuario / Cliente
</option>
</select>
</label>
<label>
Estado
<select v-model.number=" form.activo " >
<option :value="1"> Activo </option>
<option :value="0">Inactivo</option>
</select>
</label>
<p v-if="error" class="form-message error">
{{ error }}
</p>
<div class="modal-actions">
<button type="button" @click=" modal = false " >
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