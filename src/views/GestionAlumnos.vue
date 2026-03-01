<script setup>
import { ref, onMounted } from 'vue';
import { alumnoService } from '../services/alumno';
import { usuariosServicios } from '@/services/usuarios';

const alumnos = ref([]);
// Sincronizamos los nombres con lo que muestra la tabla
const Z_ID = 'Victor';
const form = ref({ 
  nia: '', 
  nombre: '', 
  apellidos: '', 
  curso_id: null,
  correo_electronico: '',
  tutor_legal_contacto:'',
  estado_id: null
});

const buscador= ref({
    text:''
})

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

const cargarEspacios = async () => {
    try {
        const datos = await espaciosService.listar();
        espaciosOriginales.value = datos;

        espaciosMostrados.value = []; 

        for (const espacio of espaciosOriginales.value) {
            if (espacio.estado_operativo === 'OP') {
                espaciosMostrados.value.push(espacio);
            }
        }
    } catch (error) {
        console.error("Error al cargar espacios:", error);
    }
}

// CORRECCIÓN PARA GUARDAR (Ajustado a tu imagen de la API)
const guardar = async () => {
    // La API espera formato ISO String según tu imagen
    const ahora = new Date().toISOString();
    const datosAEnviar = {
        ...form.value,
        zusuario: Z_ID
    };
    const datosUsuario = {
        login: `${form.value.nombre} ${form.value.apellidos}`,
        password_hash: String(form.value.nia),
        rol_id: 'Alum',
        ref_identidad_fk: String(form.value.nia),
        estado_id: 'act',
        ultimo_acceso: ahora,
        zfecha: ahora,
        zusuario: Z_ID
    };

    try {
        const res = await alumnoService.crear(datosAEnviar);       
        if (res.ok) {
            const respuestaUsuario = await usuariosServicios.crear(datosUsuario); 
            if (respuestaUsuario.ok) {
                alert("Alumno y Usuario creados.");
                form.value = { nia: '', nombre: '', apellidos: '', curso_id: null, correo_electronico: '', tutor_legal_contacto: '', estado_id: null };
                await cargar();
            } else {
                alert("Alumno creado, pero el usuario no");
            }
        } else {
            alert("Error: El DNI o Correo ya existen. No se ha creado ninguno++");
        }
    } catch (error) {
        console.error("Error crítico en guardar:", error);
        alert("No se pudo completar la operación. Revisa la consola.");
    }
};


const actualizar = async () => {
  const datosAEnviar = {
      ...formUpdate.value,
      zusuario: Z_ID
    };
  const res = await alumnoService.actualizar(formUpdate.value.nia, datosAEnviar);
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

//En caso de encontrar coincidencias mostrariamos solo las coincidencias halladas con la función filter
//que tiene un uso muy parecido a un where en base de datos
const buscarAlumnos = async() =>{
  const alumnosBucados = await alumnoService.listar();
  if(!buscador.value.text){
    alumnos.value = alumnosBucados;
  }

  const comparador = buscador.value.text;

  alumnos.value = alumnosBucados.filter(
    a=> a.nia === comparador || a.curso_id === comparador || a.apellidos === comparador
  )
}

//Se muestran todos los registros de nuevo
const mostrarTodos = async () => {
  buscador.value.text = ''; 
  await cargar(); 
};

onMounted(cargar);
</script>

<template>
  <div>
    <h3>Buscar alumnos por DNI/NIE, Nombre o apellidos</h3>
    <form @submit.prevent="buscarAlumnos" class="buscador">
        <input v-model="buscador.text" placeholder="Introduce el texto por el que quieras buscar al alumno" class="inputBuscador"><br>
        <button type="submit" id="btn-search">Buscar</button>
        <button type="button" @click="mostrarTodos" id="btn-limpiar">Mostrar Todos</button>
    </form>
  </div>
  <div class="modulo">
    <h2>Gestión de alumnos</h2> 
    <div class="contenido">
        <h3>Dar de alta un alumno</h3>
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
        <h3>Modificar un alumno</h3>
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

.inputBuscador{
  width: 400px;
  padding: 5px 3px;
}
#btn-search{
  width: 100px;
  padding: 5px 10px;
}

#btn-limpiar{
  width: 100px;
  padding: 6px 3px;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  margin-left: 10px;
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