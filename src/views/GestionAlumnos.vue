<script setup>
import { ref, onMounted } from 'vue';
import { alumnoService } from '../services/alumno';

const alumnos = ref([]);
// Sincronizamos los nombres con lo que muestra la tabla
const form = ref({ 
  nia: '', 
  nombre: '', 
  apellidos: '', 
  curso_id: null,
  correo_electronico: '',
  tutor_legal_contacto:'',
  estado_id: null
});

const formUpdate = ref({ 
  nia: '', 
  nombre: '', 
  apellidos: '', 
  curso_id: null,
  correo_electronico: '',
  tutor_legal_contacto:'',
  estado_id: null
});

const cargar = async () => { 
  alumnos.value = await alumnoService.listar(); 
};

const guardar = async () => {
    const res = await alumnoService.crear(form.value);
    if (res.ok) {
        alert("Alta correcta");
        // Limpiamos el formulario para el siguiente registro
        form.value = {nia: '',nombre: '', apellidos: '',curso_id:'', correo_electronico: '',tutor_legal_contacto:'', estado_id:''};
        cargar();
    } else {
        alert("Error: DNI o correo duplicado");
    }
};

const actualizar = async () => {
  const res = await alumnoService.actualizar(formUpdate.value.nia, formUpdate.value);
  if(res.ok){
    alert("Datos actualizados con éxito!");
    formUpdate.value = {nia: '',nombre: '', apellidos: '',curso_id:'', correo_electronico: '',tutor_legal_contacto:'', estado_id:''};
    await cargar();
  }else{
    alert("No se puede actualizar el registro");
  }
}

const borrar = async (nia) => {
    if (confirm("¿Desea cancelar las reservas activas de este profesor?")) {
        await alumnoService.eliminar(nia);
        cargar();
    }
};

onMounted(cargar);
</script>

<template>
  <div class="modulo">
    <h2>Gestión de alumnos</h2> 
    <div class="contenido">
        <h3>Dar de alta un profesor</h3>
        <form @submit.prevent="guardar">
            <input v-model="form.nia" placeholder="DNI/NIE" required><br><br>
            <input v-model="form.nombre" placeholder="Nombre" required><br><br>
            <input v-model="form.apellidos" placeholder="Apellidos" required><br><br>
            <input v-model="form.curso_id" placeholder="ID Curso" required><br><br>
            <input v-model="form.correo_electronico" placeholder="Correo electronico" required><br><br>
            <input v-model="form.tutor_legal_contacto" placeholder="Tutor legal" required><br><br>
            <input v-model.number="form.estado_id" placeholder="Estado ID" required><br><br>
            <button type="submit">Dar de Alta</button>
        </form>
    </div>
    <div class="contenido">
        <table>
            <thead>
                <tr>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Curso</th>
                    <th>Correo</th>
                    <th>Tutor legal</th>
                    <th>Estado ID</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="a in alumnos" :key="a.nia">
                    <td>{{ a.nia }}</td>
                    <td>{{ a.nombre }}</td>
                    <td>{{ a.apellidos }}</td>
                    <td>{{ a.curso_id }}</td>
                    <td>{{ a.correo_electronico }}</td>
                    <td>{{ a.tutor_legal_contacto }}</td>
                    <td>{{ a.estado_id }}</td>
                    <td>
                        <button @click="borrar(a.nia)" class="btn-borrar">Eliminar</button>
                    </td>
                </tr>
        </tbody>
        </table>
    </div>
    <div class="contenido">
        <h3>Modificar un profesor</h3>
        <form @submit.prevent="actualizar">
            <input v-model="formUpdate.nia" placeholder="DNI/NIE" required><br><br>
            <input v-model="formUpdate.nombre" placeholder="Nombre" required><br><br>
            <input v-model="formUpdate.apellidos" placeholder="Apellidos" required><br><br>
            <input v-model.number="formUpdate.curso_id" placeholder="ID Curso" required><br><br>
            <input v-model="formUpdate.correo_electronico" placeholder="Correo electronico" required><br><br>
            <input v-model="formUpdate.tutor_legal_contacto" placeholder="Tutor legal" required><br><br>
            <input v-model.number="formUpdate.estado_id" placeholder="Estado ID" required><br><br>
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