const API_URL = "http://100.52.46.68:3000/alumnos";

export const alumnoService = {
    async listar() {
        const res = await fetch(API_URL);
        return await res.json();
    },
    async crear(datos) {
        const nuevoAlumno = { ...datos };
        return await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoAlumno)
        });
    },
    async actualizar(nia, datos) {
        return await fetch(`${API_URL}/${nia}`,{
            method:'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        });
    },
    async eliminar(id) {
        return await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    }
};