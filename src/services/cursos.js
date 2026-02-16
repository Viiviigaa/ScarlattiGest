const API_URL = "http://100.52.46.68:3000/cursos";

export const cursosService = {
    async listar() {
        const res = await fetch(API_URL);
        return await res.json();
    },
    async crear(datos) {
    return await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos) // Ahora enviamos los datos completos con ID
    });
},
    async actualizar(id, datos) {
        return await fetch(`${API_URL}/${id}`,{
            method:'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        });
    },
    async eliminar(id) {
        // H3-CA2: La lógica de confirmación de reservas se maneja en el componente [cite: 21]
        return await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    }
};