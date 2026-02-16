<script setup>
import { ref } from 'vue';
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

// CORRECCIÓN: Declaramos la variable reactiva para la navegación
const seccion = ref('profesores'); 

//Loguearse
const autenticado = ref(false);
const rol_usuario = ref(null);
const UserLogin = ref('');
const passwordLogin = ref('');

const login = async() => {
  try{
    const response = await fetch('http://100.52.46.68:3000/usuarios');
    const usuarios = await response.json();

    const usuarioEncontrado = usuarios.find(
      //Utilizamos en el primer campo el nombre real que  tiene en el JSON
      u=>u.login === UserLogin.value && 
      u.password_hash === passwordLogin.value
    );

    if(usuarioEncontrado){
      autenticado.value=true;
      rol_usuario.value = usuarioEncontrado.rol_id;
    }else{
      alert("Usuario o contraseña incorrectos");
    }

  }catch(error){
    console.error("Error al conectar con la API");
  }
}

const logout = () =>{
  autenticado.value = false;
  rol_usuario.value = null;
  UserLogin.value = '';
  passwordLogin.value = '';
}

</script>
<template>
  <div v-if="!autenticado" class="login-container">
    <h2>Iniciar Sesión</h2>
    <input v-model="UserLogin" type="text" placeholder="Ingresa tu nombre de usuario"/>
    <input v-model="passwordLogin" type="password" placeholder="Ingresa tu contraseña"/>
    <button id="submitLogin" @click="login">Entrar</button><br><br>
  </div>
  <div v-else class="app-container">
    <header>
      <nav>
        <button v-if="rol_usuario === '1'" @click="seccion = 'profesores'">Profesores</button>
        <button v-if="rol_usuario === '1' || rol_usuario==='2'" @click="seccion = 'alumnos'">Alumnos</button>
        <button v-if="rol_usuario === '1' || rol_usuario==='2'" @click="seccion = 'cursos'">Cursos</button>
        <button v-if="rol_usuario === '1' || rol_usuario==='2'" @click="seccion = 'espacios'">Espacios</button>
        <button v-if="rol_usuario === '1'" @click="seccion = 'departamentos'">Departamentos</button>
        <button v-if="rol_usuario === '1'" @click="seccion = 'usuarios'">Usuarios</button>
        <button v-if="rol_usuario === '1'" @click="seccion = 'roles'">Roles</button>
        <button v-if="rol_usuario === '1'" @click="seccion = 'estadoUsuarios'">Estado Usuarios</button>
        <button v-if="rol_usuario === '1'" @click="seccion = 'etapas'">Etapas</button>
        <button v-if="rol_usuario === '1'" @click="seccion = 'turnos'">Turnos</button>
        <button v-if="rol_usuario === '1' || rol_usuario==='2'">Reservar aula</button>
        <button @click="logout" style="margin-left: auto; background: #ffcccc;">Cerrar Sesión</button>
      </nav>
    </header>
    <main>
      <GestionProfesores v-if="seccion === 'profesores' && rol_usuario === '1'" />
      <GestionAlumnos v-else-if="seccion === 'alumnos'" />
      <GestionCursos v-else-if="seccion === 'cursos' && (rol_usuario === '1'|| rol_usuario==='2')" />
      <GestionEspacios v-else-if="seccion === 'espacios' && (rol_usuario === '1'|| rol_usuario==='2')" />
      <GestionDepartamentos v-else-if="seccion === 'departamentos' && (rol_usuario === '1')" />
      <GestionUsuarios v-else-if="seccion === 'usuarios' && (rol_usuario === '1')" />
      <GestionRoles v-else-if="seccion === 'roles' && (rol_usuario === '1')" />
      <GestionEstadoUsuarios v-else-if="seccion === 'estadoUsuarios' && (rol_usuario === '1')" />
      <GestionEtapas v-else-if="seccion === 'etapas' && (rol_usuario === '1')" />
      <GestionTurnos v-else-if="seccion === 'turnos' && (rol_usuario === '1')" />
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