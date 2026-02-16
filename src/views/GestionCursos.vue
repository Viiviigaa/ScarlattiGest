<script setup>
import { ref, onMounted } from 'vue';
import { cursosService } from '../services/cursos';

const cursos = ref([]);
// Sincronizamos los nombres con lo que muestra la tabla
const form = ref({ 
  id: '', 
  nombre_curso: '', 
  etapa_id: '', 
  grupo: '',
  turno_id: '',
  anio_academico:'',
  tutor_id: '',
  aula_id: ''
});

const formUpdate = ref({ 
  id: '', 
  nombre_curso: '', 
  etapa_id: '', 
  grupo: '',
  turno_id: '',
  anio_academico:'',
  tutor_id: '',
  aula_id: ''
});

const cargar = async () => { 
  cursos.value = await cursosService.listar(); 
};
//No se porque no me funciona no me deja insertar yo creo por algún poblema con la ID
const guardar = async () => {
    const maxId = cursos.value.length > 0 
        ? Math.max(...cursos.value.map(c => c.id)) 
        : 0;
    const nuevoId = maxId + 1;
    
    const datosParaEnviar = {
        ...form.value,
        id: nuevoId
    };
    
    const { id, ...datosForm } = datosParaEnviar;
    const datosConId = { id: nuevoId, ...datosForm };
    
    const res = await cursosService.crear(datosConId);
    if (res.ok) {
        alert("Alta correcta");
        form.value = {id: '', nombre_curso: '', etapa_id: '', grupo: '', turno_id:'', anio_academico:'', tutor_id:'', aula_id:''};
        cargar();
    } else {
        alert("Ha ocurrido un error al insertar");
    }
};

const actualizar = async () => {
  const res = await  cursosService.actualizar(formUpdate.value.id, formUpdate.value);
  if(res.ok){
    alert("Datos actualizados con éxito!");
    formUpdate.value = {id: '',nombre_curso: '', etapa_id: '',grupo:'', turno_id: '',anio_academico:'', tutor_id:'', aula_id:''};
    await cargar();
  }else{
    alert("No se puede actualizar el registro");
  }
}

const borrar = async (id) => {
    if (confirm("¿Desea cancelar las reservas activas de este profesor?")) {
        await cursosService.eliminar(id);
        cargar();
    }
};

onMounted(cargar);
</script>

<template>
  <div class="modulo">
    <h2>Gestión de cursos (H3)</h2> 
    <div class="contenido">
        <h3>Dar de alta un curso</h3>
        <form @submit.prevent="guardar">
            <input v-model="form.nombre_curso" placeholder="Nombre cursos" required><br><br>
            <input v-model.number="form.etapa_id" placeholder="Etapa" required><br><br>
            <input v-model="form.grupo" placeholder="Grupo" required><br><br>
            <input v-model="form.turno_id" placeholder="Turno" required><br><br>
            <input v-model="form.anio_academico" placeholder="Año academico" required><br><br>
            <input v-model="form.tutor_id" placeholder="Tutor" required><br><br>
            <input v-model="form.aula_id" placeholder="Aula" required><br><br>
            <button type="submit">Dar de Alta</button>
        </form>
    </div>
    <div class="contenido">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre cursos</th>
                    <th>Etapa</th>
                    <th>Grupo</th>
                    <th>Turno</th>
                    <th>Año académico</th>
                    <th>Tutor</th>
                    <th>Aula</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="c in cursos" :key="c.id">
                    <td>{{ c.id }}</td>
                    <td>{{ c.nombre_curso }}</td>
                    <td>{{ c.etapa_id }}</td>
                    <td>{{ c.grupo }}</td>
                    <td>{{ c.turno_id }}</td>
                    <td>{{ c.anio_academico }}</td>
                    <td>{{ c.tutor_id }}</td>
                    <td>{{ c.aula_id }}</td>
                    <td>
                        <button @click="borrar(c.id)" class="btn-borrar">Eliminar</button>
                    </td>
                </tr>
        </tbody>
        </table>
    </div>
    <div class="contenido">
        <h3>Modificar un curso</h3>
        <form @submit.prevent="actualizar">
            <input v-model="formUpdate.id" placeholder="ID" required><br><br>
            <input v-model="formUpdate.nombre_curso" placeholder="Nombre Curso" required><br><br>
            <input v-model="formUpdate.etapa_id" placeholder="Etapa" required><br><br>
            <input v-model="formUpdate.grupo" placeholder="Grupo" required><br><br>
            <input v-model.number="formUpdate.turno_id" placeholder="ID Turno" required><br><br>
            <input v-model.number="formUpdate.anio_academico" placeholder="Año academico" required><br><br>
            <input v-model="formUpdate.tutor_id" placeholder="Tutor ID" required><br><br>
            <input v-model="formUpdate.aula_id" placeholder="Aula ID" required><br><br>
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

form input {
  width: 100%;
  padding: 5px 3px;
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