export function esCancelacionATiempo(fechaHoraCita, fechaHoraCancelacion) {
    const ochoHorasEnMilisegundos = 8 * 60 * 60 * 1000;
    const diferencia = fechaHoraCita.getTime() - fechaHoraCancelacion.getTime();
    return diferencia >= ochoHorasEnMilisegundos;
}
export function esReservaValida(cita) {
    return !!(cita.fechaHora && cita.pacienteId && cita.prestadorId && cita.locacion);
}
