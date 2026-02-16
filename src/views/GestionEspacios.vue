<script setup>
import { ref, onMounted } from 'vue';
import { espaciosService } from '../services/espacios';

const espacios = ref([]);

const form = ref({ 
  id: '', 
  nombre: '', 
  ubicacion_planta: '', 
  capacidad_max: '',
  equipamiento: '',
  estado_operativo:''
});

const formUpdate = ref({ 
  id: '', 
  nombre: '', 
  ubicacion_planta: '', 
  capacidad_max: '',
  equipamiento: '',
  estado_operativo:''
});

const cargar = async () => { 
  espacios.value = await espaciosService.listar(); 
};

const guardar = async () => {
    const res = await espaciosService.crear(form.value);
    if (res.ok) {
        alert("Alta correcta");
        // Limpiamos el formulario para el siguiente registro
        form.value = {id: '',ubicacion_planta: '', capacidad_max: '', equipamiento: '',estado_operativo:''};
        cargar();
    } else {
        alert("Error: DNI o correo duplicado");
    }
};

const actualizar = async () => {
  const res = await espaciosService.actualizar(formUpdate.value.id, formUpdate.value);
  if(res.ok){
    alert("Datos actualizados con éxito!");
    formUpdate.value = {id: '',ubicacion_planta: '', capacidad_max: '', equipamiento: '',estado_operativo:''};
    await cargar();
  }else{
    alert("No se puede actualizar el registro");
  }
}

const borrar = async (id) => {
    if (confirm("¿Desea cancelar las reservas activas de este profesor?")) {
        await profesorService.eliminar(id);
        cargar();
    }
};

onMounted(cargar);
</script>

<template>
  <div class="modulo">
    <h2>Gestión de espacios (H3)</h2> 
    <div class="contenido">
        <h3>Dar de alta un profesor</h3>
        <form @submit.prevent="guardar">
            <input v-model="form.id" placeholder="ID" required><br><br>
            <input v-model="form.nombre" placeholder="Nombre" required><br><br>
            <input v-model="form.ubicacion_planta" placeholder="Ubicacion planta" required><br><br>
            <input v-model="form.capacidad_max" placeholder="Capacidad máxima" required><br><br>
            <input v-model="form.equipamiento" placeholder="Equipamiento" required><br><br>
            <input v-model="form.estado_operativo" placeholder="Estado operativo" required><br><br>
            <button type="submit">Dar de Alta</button>
        </form>
    </div>
    <div class="contenido">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Ubicacion Planta</th>
                    <th>Capacidad</th>
                    <th>Equipamiento</th>
                    <th>Estado operativo</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="e in espacios" :key="e.id">
                    <td>{{ e.id }}</td>
                    <td>{{ e.nombre }}</td>
                    <td>{{ e.ubicacion_planta }}</td>
                    <td>{{ e.capacidad_max }}</td>
                    <td>{{ e.equipamiento }}</td>
                    <td>{{ e.estado_operativo }}</td>
                    <td>
                        <button @click="borrar(e.id)" class="btn-borrar">Eliminar</button>
                    </td>
                </tr>
        </tbody>
        </table>
    </div>
    <div class="contenido">
        <h3>Modificar un profesor</h3>
        <form @submit.prevent="actualizar">
            <input v-model="formUpdate.id" placeholder="ID" required><br><br>
            <input v-model="formUpdate.nombre" placeholder="Nombre" required><br><br>
            <input v-model="formUpdate.ubicacion_planta" placeholder="Ubicacion planta" required><br><br>
            <input v-model="formUpdate.capacidad_max" placeholder="Capacidad máxima" required><br><br>
            <input v-model="formUpdate.equipamiento" placeholder="Equipamiento" required><br><br>
            <input v-model="formUpdate.estado_operativo" placeholder="Estado operativo" required><br><br>
            <button type="submit">Actualizar</button>
        </form>
    </div>
  </div>
</template>
<style scoped>
.modulo {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 10px; 
  background-color: #f8f9fa;
  min-height: 100vh;
  display: grid;

  grid-template-columns: 280px 1fr 280px; 
  grid-template-rows: auto 1fr;
  gap: 15px;
  align-items: start;
}

h2 {
  grid-column: 1 / -1;
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 1.4rem;
  border-left: 5px solid #42b983;
  padding-left: 10px;
}

.contenido {
  background: white;
  padding: 15px; 
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

h3 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  color: #34495e;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

/* Formulario ultra compacto */
form input {
  width: 100%;
  padding: 5px 3px; /* Inputs más delgados */
  margin-bottom: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 0.85rem;
}

button[type="submit"] {
  width: 100%;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
}

/* Tabla optimizada para espacio horizontal */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem; /* Fuente más pequeña para que quepan las columnas */
}

th, td {
  padding: 8px 4px; /* Mínimo padding lateral */
  text-align: left;
  border-bottom: 1px solid #ebeef5;
  white-space: nowrap; /* Evita que el texto salte de línea */
}

th {
  background-color: #f1f3f5;
  color: #495057;
  text-transform: uppercase;
  font-size: 0.7rem;
}

/* Botón de eliminar pequeño */
.btn-borrar {
  background-color: #ffeded;
  color: #f56c6c;
  border: 1px solid #f56c6c;
  padding: 2px 6px;
  font-size: 0.7rem;
  border-radius: 3px;
  cursor: pointer;
}

/* Responsive: Si la pantalla es pequeña, vuelve a columnas normales */
@media (max-width: 1200px) {
  .modulo {
    grid-template-columns: 1fr;
  }
}
</style>