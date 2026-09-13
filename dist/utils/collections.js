// Ordenamiento (ascendente o descendente)
export function ordenarListaEspera(solicitudes, orden) {
    // Retornamos un nuevo array
    return [...solicitudes].sort((a, b) => {
        const diff = a.fechaSolicitud.getTime() - b.fechaSolicitud.getTime();
        return orden === 'asc' ? diff : -diff;
    });
}
// Filtrado 
export function filtrarCitasPorMultiplesCriterios(citas, estado, locacion) {
    return citas.filter(cita => {
        const cumpleEstado = estado ? cita.estado === estado : true;
        const cumpleLocacion = locacion ? cita.locacion === locacion : true;
        return cumpleEstado && cumpleLocacion;
    });
}
