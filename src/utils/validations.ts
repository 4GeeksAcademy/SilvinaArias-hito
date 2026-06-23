import { Cita } from '../types/models.js';

export function esCancelacionATiempo(fechaHoraCita: Date, fechaHoraCancelacion: Date): boolean {
  const ochoHorasEnMilisegundos = 8 * 60 * 60 * 1000;
  const diferencia = fechaHoraCita.getTime() - fechaHoraCancelacion.getTime();
  return diferencia >= ochoHorasEnMilisegundos;
}

export function esReservaValida(cita: Partial<Cita>): boolean {
  return !!(cita.fechaHora && cita.pacienteId && cita.prestadorId && cita.locacion);
}