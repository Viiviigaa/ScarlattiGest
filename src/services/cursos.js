const API_URL = "http://44.207.19.239:3000/cursos?zusuario=Victor";
const BASE_URL = "http://44.207.19.239:3000/cursos";
const zID = "?zusuario=Victor";

export const cursosService = {
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
    async eliminar(id) {
        // H3-CA2: La lógica de confirmación de reservas se maneja en el componente [cite: 21]
        return await fetch(`${BASE_URL}/${id}${zID}`, { method: 'DELETE' });
    }
};