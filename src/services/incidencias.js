const API_URL = "http://44.207.19.239:3000/incidencias?zusuario=Victor";
const BASE_URL = "http://44.207.19.239:3000/incidencias";
const zID = "?zusuario=Victor";

export const IncidenciasService = {
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
    async actualizar(id, datos) {
        const datosConZ = {
            ...datos,
            zusuario: "Victor"
        };

        return await fetch(`${BASE_URL}/${id}${zID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosConZ)
        });
    },
    async eliminar(id) {
        return await fetch(`${BASE_URL}/${id}${zID}`, { method: 'DELETE' });
    }
};