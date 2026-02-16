const API_URL = "http://100.52.46.68:3000/usuarios";

export const usuariosServicios = {
    async listar() {
        const res = await fetch(API_URL);
        return await res.json();
    },
    async crear(datos) {
        return await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos) 
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
        return await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    }
};