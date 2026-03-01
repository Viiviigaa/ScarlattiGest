<script setup>
import { ref, onMounted, inject} from 'vue';

import { IncidenciasService } from '@/services/incidencias';
import { espaciosService } from '@/services/espacios';

const incidencias = ref([]);
const espacios = ref([]);
const rol = inject('rolUser');

const Z_ID = 'Victor';
const user = inject('nombreUser');
const ahora = new Date().toISOString();
const form = ref({ 
  espacio_id: '',  
  descripcion_problema:'',
});

const cargar = async () => { 
  const todasLasIncidencias = await IncidenciasService.listar();
  if(rol.value === 'Profesor' || rol.value==='Alumno'){
      incidencias.value = todasLasIncidencias.filter(i => i.usuario_login === user.value);
  }else{
    incidencias.value = todasLasIncidencias;
  }
};

const cargarEspacios = async () => {
  espacios.value = await espaciosService.listar();
}

const generarId5 = () => {
    //Rango de 10000 a 99000 para asegurar ID de 5 digitos
    return Math.floor(10000 + Math.random() * 90000);
};

const guardar = async () => {
    //Datos de la incidencia con estado como predefinido abierta
    const datosAEnviar = {
      ...form.value,
      id: generarId5(),
      usuario_login: user.value,
      estado_incidencia_id: "AB",
      responsable_resolucion_id: null,
      comentarios_resolucion: null,
      fecha_resolucion: null,
      zfecha: ahora,
      zusuario: Z_ID
    };
    const res = await IncidenciasService.crear(datosAEnviar);
    if (res.ok) {
        alert("Alta correcta");
        // Limpiamos el formulario para el siguiente registro
        form.value = {espacio_id: '', descripcion_problema: ''};
        cargar();
    } else {
        const errorData = await res.json();
        console.error("FALLO CRÍTICO DE LA API:", errorData);
        alert("Error: " + (errorData.error || "Revisa la consola F12"));
    }
};

const mostrarIncidencias = ref(false);

onMounted( () =>{
  cargar();
  cargarEspacios();
});

</script>
<template>
  <div class="contenido">
    <h2>Gestión de incidencias</h2> 
        <h3>Crear una incidencia acerca de un problema</h3>
        <label>Espacio: </label>
        <form @submit.prevent="guardar">
            <select v-model="form.espacio_id">
              <option v-for="e in espacios" :key="e.id" :value="e.id">
                   {{e.id}}:{{ e.ubicacion_planta }} - {{ e.nombre }}
              </option>
            </select>
            <br><br>
            <!-- Los espacios vamos a recorrerlos con un for haciendo un select -->
            <textarea v-model="form.descripcion_problema" placeholder="Explica brevemente el problema" required></textarea><br><br>
            <button type="submit">Dar de Alta</button>
        </form>
    </div>
    <button  v-if = "rol === 'Profesor' || rol === 'Alumno'" @click="mostrarIncidencias = !mostrarIncidencias" type="button">
      {{ mostrarIncidencias ? 'Ocultar incidencias' : 'Mostrar incidencias' }}
    </button>
    <div v-if="mostrarIncidencias===true">
      <table>
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Espacio</th>
                  <th>Usuario</th>
                  <th>Descripcion</th>
                  <th>Estado</th>
                  <th>Comentarios resolución</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="i in incidencias" :key="i.id">
                  <td>{{ i.id }}</td>
                  <td>{{ i.espacio_id }}</td>
                  <td>{{ i.usuario_login }}</td>
                  <td>{{ i.descripcion_problema }}</td>
                  <td>{{ i.estado_incidencia_id }}</td>
                  <td>{{ i.comentarios_resolucion }}</td>
              </tr>
          </tbody>
      </table>
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

form select, 
form textarea {
  width: 10%;
  padding: 8px 4px;
  margin-bottom: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
}

form textarea{
  width: 200px;
}

button[type="submit"] {
  width: 5%;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
}
button[type="button"]{
  margin-top: 10px;
  margin-bottom: 10px;
  width: 10%;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem; 
}

th, td {
  padding: 8px 4px; 
  text-align: left;
  border-bottom: 1px solid #ebeef5;
  white-space: nowrap; 
}

th {
  background-color: #f1f3f5;
  color: #495057;
  text-transform: uppercase;
  font-size: 0.7rem;
}

.btn-primary{
  background-color: rgb(110, 110, 255);
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  color:white;
  width: 150px;
}
.btn-borrar {
  background-color: #ffeded;
  color: #f56c6c;
  border: 1px solid #f56c6c;
  padding: 2px 6px;
  font-size: 0.7rem;
  border-radius: 3px;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .modulo {
    grid-template-columns: 1fr;
  }
}
</style>