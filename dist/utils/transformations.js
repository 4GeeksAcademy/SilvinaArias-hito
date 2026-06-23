import { esCancelacionATiempo } from './validations.js';
// Calcular duracion promedio de citas
export function calcularPromedioDuracionCitas(citas) {
    if (citas.length === 0)
        return 0; // Caso límite
    const totalMinutos = citas.reduce((acc, cita) => acc + cita.duracionMinutos, 0);
    return totalMinutos / citas.length;
}
// Conteo y porcentajes (Tasa No-Show)
export function calcularTasaNoShow(citas) {
    if (citas.length === 0)
        return 0;
    const inasistencias = citas.filter(cita => cita.estado === 'ausente').length;
    return (inasistencias / citas.length) * 100;
}
// Generador de factura (FUNCIÓN PURA: Ya no muta la Cita original, solo genera datos)
export function generarFacturaCancelacion(cita, medico, fechaCancelacion) {
    const aTiempo = esCancelacionATiempo(cita.fechaHora, fechaCancelacion);
    if (aTiempo) {
        return null; // Si es a tiempo, no hay factura
    }
    // Retorna un nuevo objeto Factura sin alterar los parámetros de entrada
    return {
        id: `FAC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        citaId: cita.id,
        monto: medico.honorariosBase * 0.5,
        motivo: 'Penalización por Cancelación Tardía',
        estado: 'pendiente'
    };
}
