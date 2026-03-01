export const estadosOperativos = ({
    OPERATIVO:{
        id: "OP",
        nombre: "Operativo",
        permitirReserva: true,
        descripcion: "El aula está perfecta y lista para usarse"
    },
    MANTENIMIENTO:{
        id: "MAN",
        nombre: "Mantenimiento",
        permitirReserva: false,
        descripcion: "Limpieza, reparaciones menores o actualización de software"
    },
    AVERIADO:{
        id: "AVE",
        nombre: "Averiado",
        permitirReserva: false,
        descripcion: "Existe un problema grave"
    },
    CLAUSURADO:{
        id: "CLAU",
        nombre: "Clausurado",
        permitirReserva: false,
        descripcion: "El aula está perfecta y lista para usarse"
    },
});