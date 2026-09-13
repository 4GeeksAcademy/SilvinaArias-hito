export type EstadoCita = 'reservada' | 'cumplida' | 'ausente' | 'cancelada_a_tiempo' | 'cancelada_tarde';

export interface Paciente {
  id: string;
  nombre: string;
  documentoIdentidad: string;
  telefono: string;
  pais: 'Estados Unidos' | 'Reino Unido';
}

export interface PrestadorMedico {
  id: string;
  nombre: string;
  especialidad: string;
  locacion: string;
  honorariosBase: number;
}

export interface Cita {
  id: string;
  pacienteId: string;
  prestadorId: string;
  fechaHora: Date;
  duracionMinutos: number;
  locacion: string;
  estado: EstadoCita;
}

export interface SolicitudListaEspera {
  id: string;
  pacienteId: string;
  prestadorId: string;
  especialidad: string;
  fechaSolicitud: Date;
  locacion: string;
}

export interface Factura {
  id: string;
  citaId: string;
  monto: number;
  motivo: 'Consulta Estándar' | 'Penalización por Cancelación Tardía';
  estado: 'pendiente' | 'paga' | 'enviada_a_seguro';
}