const API_URL = "http://44.207.19.239:3000/usuarios?zusuario=Victor";
const BASE_URL = "http://44.207.19.239:3000/usuarios";
const zID = "?zusuario=Victor";


export const usuariosServicios = {
    async listar() {
        const res = await fetch(API_URL);
        return await res.json();
    },
    async crear(datos) {
         const datosConZ = {
            ...datos,
            zusuario: "Victor"
        };
        return await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosConZ)
        });
    },
    async actualizar(login, datos) {
        const datosConZ = {
            ...datos,
            zusuario: "Victor"
        };

        return await fetch(`${BASE_URL}/${login}${zID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosConZ)
        });
    },
    async eliminar(login) {
        return await fetch(`${BASE_URL}/${login}${zID}`, { method: 'DELETE' });
    }
};