<script setup>
import { ref, onMounted } from 'vue';
import { profesorService } from '../services/profesores';

const profesores = ref([]);
// Sincronizamos los nombres con lo que muestra la tabla
const form = ref({ 
  nombre: '', 
  apellidos: '', 
  dni_nie: '', 
  correo_institucional: '',
  departamento_id: '',
  rol_id:'',
  password_hash: ''
});

const formUpdate = ref({ 
  dni_nie: '', 
  nombre: '', 
  apellidos: '', 
  correo_institucional: '',
  departamento_id: null,
  rol_id: null,
  password_hash: ''
});

const cargar = async () => { 
  profesores.value = await profesorService.listar(); 
};

const guardar = async () => {
    const res = await profesorService.crear(form.value);
    if (res.ok) {
        alert("Alta correcta");
        // Limpiamos el formulario para el siguiente registro
        form.value = {dni_nie: '',nombre: '', apellidos: '', correo_institucional: '',departamento_id:'', rol_id:'', password_hash:''};
        cargar();
    } else {
        alert("Error: DNI o correo duplicado");
    }
};

const actualizar = async () => {
  const res = await profesorService.actualizar(formUpdate.value.dni_nie, formUpdate.value);
  if(res.ok){
    alert("Datos actualizados con éxito!");
    formUpdate.value = {dni_nie: '',nombre: '', apellidos: '',correo_institucional:'', departamento_id: '',rol_id:'', password_hash:''};
    await cargar();
  }else{
    alert("No se puede actualizar el registro");
  }
}

const borrar = async (dni_nie) => {
    if (confirm("¿Desea cancelar las reservas activas de este profesor?")) {
        await profesorService.eliminar(dni_nie);
        cargar();
    }
};

onMounted(cargar);
</script>

<template>
  <div class="modulo">
    <h2>Gestión de Profesores (H3)</h2> 
    <div class="contenido">
        <h3>Dar de alta un profesor</h3>
        <form @submit.prevent="guardar">
            <input v-model="form.dni_nie" placeholder="DNI/NIE" required><br><br>
            <input v-model="form.nombre" placeholder="Nombre" required><br><br>
            <input v-model="form.apellidos" placeholder="Apellidos" required><br><br>
            <input v-model="form.correo_institucional" placeholder="Correo Institucional" required><br><br>
            <input v-model.number="form.departamento_id" placeholder="ID Departamento" required><br><br>
            <input v-model.number="form.rol_id" placeholder="Rol" required><br><br>
            <input v-model="form.password_hash" placeholder="Password" required><br><br>
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
                    <th>Correo</th>
                    <th>Departamento</th>
                    <th>Rol</th>
                    <th>Password</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in profesores" :key="p.dni_nie">
                    <td>{{ p.dni_nie }}</td>
                    <td>{{ p.nombre }}</td>
                    <td>{{ p.apellidos }}</td>
                    <td>{{ p.correo_institucional }}</td>
                    <td>{{ p.departamento_id }}</td>
                    <td>{{ p.rol_id }}</td>
                    <td>{{ p.password_hash }}</td>
                    <td>
                        <button @click="borrar(p.dni_nie)" class="btn-borrar">Eliminar</button>
                    </td>
                </tr>
        </tbody>
        </table>
    </div>
    <div class="contenido">
        <h3>Modificar un profesor</h3>
        <form @submit.prevent="actualizar">
            <input v-model="formUpdate.dni_nie" placeholder="DNI/NIE" required><br><br>
            <input v-model="formUpdate.nombre" placeholder="Nombre" required><br><br>
            <input v-model="formUpdate.apellidos" placeholder="Apellidos" required><br><br>
            <input v-model="formUpdate.correo_institucional" placeholder="Correo Institucional" required><br><br>
            <input v-model.number="formUpdate.departamento_id" placeholder="ID Departamento" required><br><br>
            <input v-model.number="formUpdate.rol_id" placeholder="Rol" required><br><br>
            <input v-model="formUpdate.password_hash" placeholder="Password" required><br><br>
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