const API_URL = "http://100.52.46.68:3000/profesores";

export const profesorService = {
    async listar() {
        const res = await fetch(API_URL);
        return await res.json();
    },
    async crear(datos) {
        const nuevoProfesor = { ...datos}; 
        return await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProfesor)
        });
    },
    async actualizar(dni_nie, datos) {
        return await fetch(`${API_URL}/${dni_nie}`,{
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