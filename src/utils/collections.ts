import { SolicitudListaEspera, Cita } from '../types/models.js';

// Ordenamiento (ascendente o descendente)
export function ordenarListaEspera(
  solicitudes: SolicitudListaEspera[], 
  orden: 'asc' | 'desc'
): SolicitudListaEspera[] {
  // Retornamos un nuevo array
  return [...solicitudes].sort((a, b) => {
    const diff = a.fechaSolicitud.getTime() - b.fechaSolicitud.getTime();
    return orden === 'asc' ? diff : -diff;
  });
}

// Filtrado 
export function filtrarCitasPorMultiplesCriterios(
  citas: Cita[], 
  estado?: Cita['estado'], 
  locacion?: string
): Cita[] {
  return citas.filter(cita => {
    const cumpleEstado = estado ? cita.estado === estado : true;
    const cumpleLocacion = locacion ? cita.locacion === locacion : true;
    return cumpleEstado && cumpleLocacion;
  });
}