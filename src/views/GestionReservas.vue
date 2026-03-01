<script setup>
    import { ref, onMounted, inject } from 'vue';
    import { reservasService } from '@/services/reservas';
    import { espaciosService } from '../services/espacios';
    import { horariosServicios } from '@/services/horarios';

    const Z_ID = 'Victor';
    const user = inject('nombreUser');
    const rol = inject('rolUser');
    const fechaActual = ref(new Date().toISOString().split('T')[0]);

    const reservas = ref([]);
    const espacios = ref([]);
    const horarios = ref([]);

//Formulario del insert vacio
const form = ref({ 
  id: '', 
  espacio_id: '', 
  horario_id: '', 
  fecha_reserva:'',
  motivo_reserva: ''
});

//Formulario del update vacio
const formUpdate = ref({ 
    id: '', 
    espacio_id: '', 
    horario_id: '', 
    fecha_reserva:'',
    motivo_reserva: ''
});

//Funciones para cargar la información de las tablas reservas y espacios
const cargar = async () => { 
    const todasLasReservas = await reservasService.listar();
    if (rol.value === 'Profesor') {
        reservas.value = todasLasReservas.filter(r => r.usuario_login === user.value);
    } else {
        reservas.value = todasLasReservas;
    }
};

const cargarHorarios =  async () => {
    horarios.value = await horariosServicios.listar();
}


const guardar = async () => {
    const datosAEnviar = {
      ...form.value,
      usuario_login: user.value,
      zfecha: fechaActual.value,
      zusuario: Z_ID
    };
    const res = await reservasService.crear(datosAEnviar);
    if (res.ok) {
        alert("Alta correcta");
        // Limpiamos el formulario para el siguiente registro
        form.value = {id: '',espacio_id: '', horario_id: '', usuario_login: '', fecha_reserva: '', motivo_reserva:''};
        cargar();
    } else {
        const errorData = await res.json();
        console.error("FALLO CRÍTICO DE LA API:", errorData);
        alert("Error: " + (errorData.error || "Revisa la consola F12"));
    }
};

const actualizar = async () => {
  const datosAEnviar = {
    ...formUpdate.value,
    usuario_login: user.value,
    zfecha: fechaActual.value,
    zusuario: Z_ID
  };

  const res = await reservasService.actualizar(formUpdate.value.id, datosAEnviar);
  if(res.ok){
    alert("Datos actualizados con éxito!");
    formUpdate.value = {id: '',espacio_id: '', horario_id: '', usuario_login: '', fecha_reserva: '', motivo_reserva:''};
    await cargar();
  }else{
    const errorData = await res.json();
    console.error("FALLO CRÍTICO DE LA API:", errorData);
    alert("Error: " + (errorData.error || "Revisa la consola F12"));
  }
}

const eliminar = async (id) => {
    if (confirm("¿Desea cancelar las reservas activas de este profesor?")) {
        await reservasService.eliminar(id);
        cargar();
    }
};

const espaciosOriginales = ref([]); 
const espaciosMostrados = ref([]); 
const plantaSeleccionada = ref('');

const cargarEspacios = async() => {
    const datos = await espaciosService.listar();
    espaciosOriginales.value = datos; // Copia de los datos
    for(const espacios of espaciosOriginales.value){
        if(espacios.estado_operativo === 'OP'){
            espaciosMostrados.value.push(espacios);
        }
    }
}

//Filtrado en función de la ubicación del espacio
const ejecutarFiltrado = () => {
    if (!plantaSeleccionada.value) { //En caso de que todavia no se haya hecho click en filtrar
        espaciosMostrados.value = [...espaciosOriginales.value];
    } else {
        //Le damos el valor a los espacios mostrados en función de si coincide la respuesta del select con los datos de nuestra base de datos
        espaciosMostrados.value = espaciosOriginales.value.filter(e => 
            e.ubicacion_planta === plantaSeleccionada.value && e.estado_operativo === 'OP'
        );
    }
};

const mostrarFormulario = ref(false);
const nuevaReserva = ref({id: '', espacio_id: '', horario_id:'', fecha_reserva: '', motivo_reserva:''});

//Abro el formulario de reservas
const abrirReserva = (id, estado) => {
    nuevaReserva.value.espacio_id = id;
    nuevaReserva.value.estado_operativo = estado;
    mostrarFormulario.value = true;
};

const generarId5 = () => {
    //Rango de 10000 a 99000 para asegurar ID de 5 digitos
    return Math.floor(10000 + Math.random() * 90000);
};

const confirmarNuevaReserva = async(espacio, horario, fechaReserva, motivo, estado) =>{
    try{
    //Guardamos aqui todos los datos 
    const datosAEnviar = {
        id: generarId5(),
        espacio_id: espacio,
        horario_id: horario,
        usuario_login: user.value,
        fecha_reserva: fechaReserva,
        motivo_reserva: motivo,
        zfecha: fechaActual.value,
        zusuario: Z_ID
    }

    const respuesta = await fetch('http://44.207.19.239:3000/reservas?zusuario=Victor');
    const reservasExistentes = await respuesta.json();
    const estadoEspacio = estado;

    //comprobamos que el espacio, a la hora y fecha solicitada este o no ocupado
    const ocupado = reservasExistentes.find(reserva => {
        //Formateamos las fechas para que tengan la misma longitud y formato
        const fechaAPI = reserva.fecha_reserva.split('T')[0];
        const fechaUsuario = fechaReserva.split('T')[0];
        return Number(reserva.espacio_id) === Number(espacio) && Number(reserva.horario_id) === Number(horario) && fechaAPI === fechaUsuario;
    });

    //Si no esta ocupado y el estado del espacio es operativo entonces procedemos a realizar la reserva
    if(!ocupado && estadoEspacio==='OP'){
        const res = await reservasService.crear(datosAEnviar);
         if (res.ok) {
            alert("Alta correcta");
            nuevaReserva.value = {id: '',espacio_id: '', horario_id: '', usuario_login: '', fecha_reserva: '', motivo_reserva:''};
            cargar();
        } else {
            const errorData = await res.json();
            console.error("FALLO CRÍTICO DE LA API:", errorData);
            alert("Error: " + (errorData.error || "Revisa la consola F12"));
        }
    }else{
        alert("El espacio que intentas reservas está ocupado");
    }
    }catch(error){
        alert("No se puede verificar si está disponible el espacio");
    }

}
//Gracias a este booleano podemos mostrar o ocultar las reservas
const mostrarReservas = ref(false);

onMounted(async () => {
    await cargar();
    await cargarEspacios();
    await cargarHorarios();
});

</script>
<template>
    <h3>Espacios</h3>
    <div class="espacios">
    <form @submit.prevent="ejecutarFiltrado">
        <select v-model="plantaSeleccionada" name="ubicacion">
            <option value="Planta baja">Planta Baja</option>
            <option value="Primera planta">Primera Planta</option>
            <option value="Segunda Planta">Segunda planta</option>
        </select>
        <input type="submit" id="filtro" value="Filtrar">
    </form>
    </div>
    <div class="contenido">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Ubicacion</th>
                    <th>Capacidad máxima</th>
                    <th>Equipamiento</th>
                    <th>Estado operativo</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in espaciosMostrados" :key="p.id">
                    <td>{{ p.id }}</td>
                    <td>{{ p.nombre }}</td>
                    <td>{{ p.ubicacion_planta }}</td>
                    <td>{{ p.capacidad_max }}</td>
                    <td>{{ p.equipamiento }}</td>
                    <td>{{ p.estado_operativo }}</td>
                    <td><button class="btn-reserva" v-on:click="abrirReserva(p.id, p.estado_operativo)">Reservar</button></td>
                </tr>
        </tbody>
        </table>
    </div>
    <br><br><br>
    <div v-if="mostrarFormulario">
        <form action="">         
                <h3>Reserva para el aula {{ nuevaReserva.espacio_id }}</h3>
                <label>Horario:</label><br>
                <select v-model="nuevaReserva.horario_id" id="selectReserva">
                    <option disabled value="">Seleccione un horario</option>
                    <option v-for="h in horarios" :key="h.id" :value="h.id">
                        {{ h.nombre }} ({{ h.hora_inicio }} - {{ h.hora_fin }})
                    </option>
                </select><br>

                <label>Fecha:</label><br>
                <input type="date" min="2026-03-01" max="2026-06-20" v-model="nuevaReserva.fecha_reserva"><br>

                <label>Motivo:</label><br>
                <input v-model="nuevaReserva.motivo_reserva" placeholder="Ej: Clase de refuerzo">

                <div><br>
                    <button @click.prevent="confirmarNuevaReserva(nuevaReserva.espacio_id, nuevaReserva.horario_id,nuevaReserva.fecha_reserva,nuevaReserva.motivo_reserva, nuevaReserva.estado_operativo)" class="btn-reservar">Confirmar Reserva</button>
                    <button @click="mostrarFormulario = false" class="btn-mostrar">Cancelar</button>
                </div>           
            </form>
        </div>   
        <br><br> 
        <button v-if="mostrarReservas" @click="mostrarReservas = false">Ocultar reservas</button>
        <button v-else @click="mostrarReservas = true">Mostrar reservas</button>

        <br><br>
        <div v-if="mostrarReservas">
        <h2>Gestión de reservas</h2> 
        <div class="contenido">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Espacio</th>
                    <th>Horario</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Motivo de la reserva</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in reservas" :key="p.id">
                    <td>{{ p.id }}</td>
                    <td>{{ p.espacio_id }}</td>
                    <td>{{ p.horario_id }}</td>
                    <td>{{ p.usuario_login }}</td>
                    <td>{{ p.fecha_reserva }}</td>
                    <td required>{{ p.motivo_reserva }}</td>
                    <td v-if="rol ==='Administrador'">
                        <button @click="eliminar(p.id)" class="btn-borrar">Eliminar</button>
                    </td>
                </tr>
        </tbody>
        </table>
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

.espacios{
    display: flex;
    justify-content: left;
    margin-left: 10px;
}
.espacios select{
    padding: 4px;
    border-radius: 4px;
}

#filtro{
    background-color: #42b983;
    width: 100px;
    text-align: center;
    margin: 10px;
}
h2 {
  grid-column: 1 / -1;
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 1.4rem;
  border-left: 5px solid #42b983;
  padding-left: 10px;
}

form input{
    width: 15%;
    padding: 5px 3px;
    margin-bottom: 15px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #606266;
    background-color: #fff;
    box-sizing: border-box; /* Asegura que el padding no rompa el ancho */
    transition: border-color 0.2s, box-shadow 0.2s;
}

#selectReserva{
    width: 15%;
    padding: 5px 3px;
    border-radius: 6px;
    margin-bottom: 15px;
}

button{
    background-color: #42b983;
    width: 100px;
    text-align: center;
    margin: 5px;
    padding: 5px 3px;
    width: 8%;
    height: 50px;
    border-radius: 6px;

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
  width: 100px;
}

.btn-reserva{
    width: 100px;
}

.btn-mostrar{
    width: 100px;
}
/* Responsive: Si la pantalla es pequeña, vuelve a columnas normales */
@media (max-width: 1200px) {
  .modulo {
    grid-template-columns: 1fr;
  }
}
</style>