<script setup>
import { ref, onMounted, inject} from 'vue';
import { IncidenciasService } from '@/services/incidencias';
import { estadosIncidenciasService } from '@/services/estadosIncidencias';

//Arrays para poder guardar la información de las incidencias listadas y luego poder filtrar y sacar informacion
const incidencias = ref([]);
const estadosIncidencias = ref([]);
//ZID
const Z_ID = 'Victor';
//Usuario, fecha actual y booleano para mostrar y esconder el formulario
const user = inject('nombreUser');
const ahora = new Date().toISOString();
const mostrarFormulario = ref(false);
//Formulario con los campos necesarios
const form = ref({ 
  id: '',  
  estado_incidencia_id:'',
  comentarios_resolucion: ''
});
//Métodos CRUD de Incidencias
const cargar = async () => { 
  incidencias.value = await IncidenciasService.listar(); 
};

const cargarEstadosIncidencias = async () =>{
  estadosIncidencias.value = await estadosIncidenciasService.listar();
}

const actualizar = async () => {
  //En función del estado de la incidencia asignamos unos valore u otros ya que no en todos
  //nos interesa tener los mismos valores, entonces los asignamos mediante un switch
  switch (form.value.estado_incidencia_id) {
    case 'AB':
      form.value.responsable_resolucion_id = null;
      break;
    case 'PR': 
      form.value.responsable_resolucion_id = user; 
      break;
    case 'RE': 
      form.value.responsable_resolucion_id = user;
      //Comprobamos que el campo del formulario de comentarios no este vacio y en caso de que sea asi frenamos 
      //la ejecución con el return
      if (!form.value.comentarios_resolucion) {
        alert("Para resolver la incidencia es obligatorio añadir un comentario.");
        return; 
      }
      break;
  }

  const datosAEnviar = {
    //Todos los datos del formulario 
    ...form.value,
    estado_incidencia_id: form.value.estado_incidencia_id,
    responsable_resolucion_id: form.value.responsable_resolucion_id,
    comentarios_resolucion: form.value.comentarios_resolucion,
    fecha_resolucion: form.value.estado_incidencia_id === 'RE' ? new Date().toISOString() : null,
    zusuario: Z_ID,
    zfecha: ahora
  };

  try {
    //Hacemos la llamada a actualizar
    const res = await IncidenciasService.actualizar(form.value.id, datosAEnviar);
    if (res.ok) {
      alert("Incidencia actualizada");
      mostrarFormulario.value = false; 
      // Limpiamos el formulario para el siguiente uso
      form.value = { id: '', estado_incidencia_id: '', comentario: '' };
      
      await cargar(); // Refrescamos la lista
    } else {
      const errorData = await res.json();
      alert("Error: " + (errorData.error || "No se pudo actualizar"));
    }
  } catch (error) {
    console.error("Error en la petición:", error);
    alert("Error de conexión con el servidor");
  }
};

const cambiarEstado = (incidencia) => {
  form.value = { ...incidencia }; 
  mostrarFormulario.value = true;
};

onMounted( () =>{
  cargar();
  cargarEstadosIncidencias()
});

</script>
<template>
  <div class="contenido">
    <h2>Resolución de incidencias</h2> 
        <table>
            <thead>
                <tr>
                  <th>ID</th>
                  <th>Espacio</th>
                  <th>Usuario</th>
                  <th>Descripción del problema</th>
                  <th>Estado</th>
                  <th>Responsable resolucion</th>
                  <th>Comentario</th>
                  <th>Fecha resolución</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in incidencias">
                  <td>{{ i.id }}</td>
                  <td>{{ i.espacio_id }}</td>
                  <td>{{ i.usuario_login }}</td>
                  <td>{{ i.descripcion_problema }}</td>
                  <td>{{ i.estado_incidencia_id }}</td>
                  <td>{{ i.responsable_resolucion_id }}</td>
                  <td>{{ i.comentarios_resolucion }}</td>
                  <td>{{ i.fecha_resolucion }}</td>
                  <td>
                    <!-- En vez de pasarle solo uno de los parametros le estamos pasando la fila entera -> i (incidencia) -->
                    <button id="submit" @click="cambiarEstado(i)">Cambiar estado</button>
                  </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="mostrarFormulario">
      <!-- Es como el prevent default hace que no se actualice por si solo, si no cuando yo quiera-->
      <form @submit.prevent="actualizar">
        <br>
        <label>Estado: </label><br>
        <select v-model="form.estado_incidencia_id">
          <option v-for="e in estadosIncidencias" :key="e.id" :value="e.id">
            {{ e.id }} - {{ e.nombre }}
          </option>
        </select><br><br>
        <label>Comentario: </label><br>
        <textarea v-model="form.comentarios_resolucion"></textarea><br>
        <button type="submit" id="submit">Cambiar estado</button>
        <button type="button" @click="mostrarFormulario=false" id="cancelar">Cancelar</button>
      </form>
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

#submit{
  margin-left: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 5px 3px;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
}

#cancelar{
  margin-left: 10px;
  width: 5%;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 5px 3px;
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