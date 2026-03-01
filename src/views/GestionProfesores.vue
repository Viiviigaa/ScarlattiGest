<script setup>
import { ref, onMounted, inject} from 'vue';
import { profesorService } from '../services/profesores';
import { usuariosServicios } from '@/services/usuarios';
import { reservasService } from '@/services/reservas';

const user = inject('nombreUser');
const Z_ID = 'Victor';
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

//MÉTODOS CRUD
const cargar = async () => { 
  profesores.value = await profesorService.listar(); 
};

const guardar = async () => {
  const ahora = new Date().toISOString();
   const datosAEnviar = {
    ...form.value,
    rol_id: 'Prof',
    password_hash: form.value.dni_nie,
    zfecha: ahora,
    zusuario: Z_ID
  };
  //Asignación de datos
  const datosUsuario = {
        login: `${form.value.nombre} ${form.value.apellidos}`,
        password_hash: String(form.value.dni_nie),
        rol_id: 'Prof',
        ref_identidad_fk: String(form.value.dni_nie),
        estado_id: 'act',
        ultimo_acceso: ahora,
        zfecha: ahora,
        zusuario: Z_ID
    };
    try {
        //Insertamos el profesor
        const res = await profesorService.crear(datosAEnviar);       
        if (res.ok) {
            //Si no  ha dado error al insertar el profesor insertar el usuario
            const respuestaUsuario = await usuariosServicios.crear(datosUsuario); 
            if (respuestaUsuario.ok) {
                //Aqui solo llegariamos en caso de haber insertado con exito ambos
                alert("Profesor y Usuario creados.");
                form.value = { dni_nie: '', nombre: '', apellidos: '', correo_institucional: '', departamento_id: ''};
                await cargar();
            } else {
                alert("Profesor creado, pero el usuario no");
            }
        } else {
            alert("Error: El DNI o Correo ya existen. No se ha creado ninguno");
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
  const res = await profesorService.actualizar(formUpdate.value.dni_nie, datosAEnviar);
  if(res.ok){
    alert("Datos actualizados con éxito!");
    formUpdate.value = {dni_nie: '',nombre: '', apellidos: '',correo_institucional:'', departamento_id: '',rol_id:'', password_hash:''};
    await cargar();
  }else{
    alert("No se puede actualizar el registro");
  }
}

const borrar = async (dni_nie) => {
    if (confirm(`¿Desea eliminar al profesor y todas sus reservas asociadas?`)) {
        try {
            
            const listaUsuarios = await usuariosServicios.listar();
            const usuarioEncontrado = listaUsuarios.find(u => 
                u.ref_identidad_fk.trim() === dni_nie.trim()
            );

            if (usuarioEncontrado) {
                const loginDelProfesor = usuarioEncontrado.login;
                const listaReservas = await reservasService.listar();
                
                const reservasParaBorrar = listaReservas.filter(r => 
                    r.usuario_login === loginDelProfesor
                );

                // Borramos reservas
                for (const reserva of reservasParaBorrar) {
                    await reservasService.eliminar(reserva.id);
                }
                // Borramos al profesor de su tabla
                await profesorService.eliminar(dni_nie);

                // Borramos al usuario de la tabla de identidades 
                await usuariosServicios.eliminar(loginDelProfesor);

                alert("Eliminación completa: Reservas, Profesor y Usuario.");
            } else {gemk
                alert("Profesor eliminado (no se encontraron reservas ni usuario vinculado).");
            }

            await cargar();

        } catch (error) {
            console.error("Error en el proceso de borrado:", error);
            alert("Error al tratar de eliminar los datos.");
        }
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