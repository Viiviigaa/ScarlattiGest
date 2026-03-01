<script setup>
import { ref, provide} from 'vue';
import GestionProfesores from './views/GestionProfesores.vue';
import GestionAlumnos from './views/GestionAlumnos.vue';
import GestionCursos from './views/GestionCursos.vue';
import GestionEspacios from './views/GestionEspacios.vue';
import GestionDepartamentos from './views/GestionDepartamentos.vue';
import GestionUsuarios from './views/GestionUsuarios.vue';
import GestionRoles from './views/GestionRoles.vue';
import GestionEstadoUsuarios from './views/GestionEstadoUsuarios.vue';
import GestionEtapas from './views/GestionEtapas.vue';
import GestionTurnos from './views/GestionTurnos.vue';
import GestionReservas from './views/GestionReservas.vue';
import GestionIncidencias from './views/GestionIncidencias.vue';
import ResolverIncidencias from './views/resolverIncidencias.vue';

// CORRECCIÓN: Declaramos la variable reactiva para la navegación
const seccion = ref(''); 

//Loguearse
const autenticado = ref(false);
const rol_id = ref(null);
provide('rolUser', rol_id);
//Proveemos la constante user para poder utilizarla en las reservas
const user = ref('');
provide('nombreUser', user);

const password = ref('');
//Declaramos nuestro ID como usuario para personalizar el acceso a la API
// Añade esta variable para tu ID de grupo/alumno
const zId = ref('Victor'); 
const errorMotivo = ref('');
//Datos para poder sacar por pantalla al iniciar sesion el nombre y apellidos de la persona que se loguea
const datosUsuario = ref({nombre: '', apellidos:''});

const login = async () => {
  try {
    const response = await fetch('http://44.207.19.239:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: user.value,    
        password: password.value, 
        zusuario: zId.value        
      })
    });
    console.log("Estado de la respuesta:", response.status);
    const data = await response.json();
    console.log("Mensaje detallado del error 400:", data);

   if (response.ok) {
      //Una vez sepamos que el login es correcto hacemos otro fetch 
      //para comprobar si el usuario está activado o no
      const resUsuarios = await fetch(`http://44.207.19.239:3000/usuarios?zusuario=Victor`);
      const usuarios = await resUsuarios.json();
      
      // Buscamos al usuario que acaba de loguearse en la lista
      const usuarioInfo = usuarios.find(u => u.login === user.value);
      //Comprobamos que exista el usuario y que su estado sea activo
      if (usuarioInfo && usuarioInfo.estado_id === 'act') {
        //Permitimos el acceso y damos valor a los datos (nombre y apellido) y limpiamos errorMotivo al haber hecho un login válido
        autenticado.value = true;
        rol_id.value = data.rol; 
        datosUsuario.value.nombre = data.nombre;
        datosUsuario.value.apellidos = data.apellidos;
        errorMotivo.value = ''; 
      } else {
        autenticado.value = false;
        errorMotivo.value = "Acceso denegado: Tu cuenta no está activa.";
      }

    } else {
      errorMotivo.value = data.motivo || "Error en el inicio de sesión";
    }
  } catch (error) {
    console.error("Error al conectar con la API:", error);
    errorMotivo.value = "Error de conexión con el servidor";
  }
}

const logout = () =>{
  //Limpiamos valores de login, al poner en negativo el autenticado saca de la app y vuelve a mostrar el login
  autenticado.value = false;
  rol_id.value = null;
  user.value = '';
  password.value = '';
  seccion.value = ref(''); 
}

</script>
<template>
  <div v-if="!autenticado" class="login-container">
    <h2>Iniciar Sesión</h2>
    <input v-model="user" type="text" placeholder="Ingresa tu nombre de usuario"/>
    <input v-model="password" type="password" placeholder="Ingresa tu contraseña"/>
    <button id="submitLogin" @click="login">Entrar</button><br><br>
  </div>
  <div v-else class="app-container">
    <header>
      <nav>
        <button  v-if="rol_id === 'Administrador'" @click="seccion = 'profesores'">Profesores</button>
        <button  v-if="rol_id === 'Administrador'" @click="seccion = 'alumnos'">Alumnos</button>
        <button  v-if="rol_id === 'Administrador'" @click="seccion = 'cursos'">Cursos</button>
        <button  v-if="rol_id === 'Administrador'" @click="seccion = 'espacios'">Espacios</button>
        <button  v-if="rol_id === 'Administrador'" @click="seccion = 'departamentos'">Departamentos</button>
        <button  v-if="rol_id === 'Administrador'" @click="seccion = 'usuarios'">Usuarios</button>
        <button  v-if="rol_id === 'Administrador'" @click="seccion = 'roles'">Roles</button>
        <button  v-if="rol_id === 'Administrador'" @click="seccion = 'estadoUsuarios'">Estado Usuarios</button>
        <button  v-if="rol_id === 'Administrador'" @click="seccion = 'etapas'">Etapas</button>
        <button  v-if="rol_id === 'Administrador'" @click="seccion = 'turnos'">Turnos</button>
        <button v-if="rol_id === 'Administrador' || rol_id === 'Profesor' || rol_id === 'Responsable Tic'" @click="seccion = 'reservas'">Reservar espacio</button>
        <button @click="seccion = 'incidencias'">Creación de incidencias</button>
        <button @click="seccion = 'resolverIncidencias'" v-if="rol_id === 'Administrador' || rol_id === 'Responsable Tic'">Resolución de incidencias</button>
        <button @click="logout" style="margin-left: auto; background: #ffcccc;">Cerrar Sesión</button>
      </nav>
    </header>
    <main>
      <!-- Podemos utilizar los componentes como etiquetas de HTML, para acceder a ellos
       en este caso filtramos por 'seccion' al hacer click sobre los botones se le da un valor 
       a la seccion en función del elegido y nos muestra el componente seleccionado
      -->
      <h3>Bienvenido {{ datosUsuario.nombre  }} {{ datosUsuario.apellidos }}</h3>
      <h4>Rol: {{ rol_id }}</h4>
      <GestionProfesores v-if="seccion === 'profesores' " />
      <GestionAlumnos v-else-if="seccion === 'alumnos'" />
      <GestionCursos v-else-if="seccion === 'cursos'" />
      <GestionEspacios v-else-if="seccion === 'espacios'" />
      <GestionDepartamentos v-else-if="seccion === 'departamentos' " />
      <GestionUsuarios v-else-if="seccion === 'usuarios'" />
      <GestionRoles v-else-if="seccion === 'roles'" />
      <GestionEstadoUsuarios v-else-if="seccion === 'estadoUsuarios'" />
      <GestionEtapas v-else-if="seccion === 'etapas'" />
      <GestionTurnos v-else-if="seccion === 'turnos'" />
      <GestionReservas v-else-if="seccion === 'reservas'"/>
      <GestionIncidencias v-else-if="seccion === 'incidencias'"/>
      <ResolverIncidencias v-else-if="seccion === 'resolverIncidencias'"/>
    </main>
  </div>
</template>
<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  gap: 1rem;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  width: 20%;
  margin: 0  auto;
  max-width: 900px;
  height: auto;
  padding: 10px;
}
#submitLogin{
  background-color: rgb(108, 108, 248);
  border: 1px solid  rgb(108, 108, 248);
  color: white;
  border-radius: 5px;
}
.login-container input{
  padding: 10px;
}
nav { 
  display: flex; 
  gap: 1rem; 
  margin-bottom: 2rem; 
  background: #eee; 
  padding: 1rem; 
}
button { 
  cursor: pointer; 
  padding: 0.5rem 1rem; 
}
</style>