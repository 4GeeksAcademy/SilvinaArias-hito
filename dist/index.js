import { esReservaValida } from './utils/validations.js';
import { ordenarListaEspera, filtrarCitasPorMultiplesCriterios } from './utils/collections.js';
import { buscarCitaPorDocumentoLineal, busquedaBinariaCitaIndice } from './utils/search.js';
import { calcularPromedioDuracionCitas, calcularTasaNoShow, generarFacturaCancelacion } from './utils/transformations.js';
// ==========================================
// 1. CREACIÓN DE DATOS DE PRUEBA (MOCK DATA)
// ==========================================
const pacientes = [
    { id: 'P001', nombre: 'Juan Pérez', documentoIdentidad: '1234567-8', telefono: '+1-555-0198', pais: 'Estados Unidos' },
    { id: 'P002', nombre: 'Emma Smith', documentoIdentidad: '9876543-2', telefono: '+44-712-3456', pais: 'Reino Unido' },
    { id: 'P003', nombre: 'Carlos Rodríguez', documentoIdentidad: '4567890-1', telefono: '+1-555-0123', pais: 'Estados Unidos' }
];
const medicos = [
    { id: 'M001', nombre: 'Dra. García', especialidad: 'Cardiología', locacion: 'Miami Health Center', honorariosBase: 200 },
    { id: 'M002', nombre: 'Dr. Jones', especialidad: 'Pediatría', locacion: 'London Hub', honorariosBase: 250 }
];
// Citas de prueba (Ordenadas por ID para poder probar la búsqueda binaria)
const listaCitas = [
    { id: 'C101', pacienteId: 'P001', prestadorId: 'M001', fechaHora: new Date('2026-07-10T10:00:00'), duracionMinutos: 30, locacion: 'Miami Health Center', estado: 'cumplida' }, // <-- Actualizado a "cumplida"
    { id: 'C102', pacienteId: 'P002', prestadorId: 'M002', fechaHora: new Date('2026-07-11T14:00:00'), duracionMinutos: 45, locacion: 'London Hub', estado: 'ausente' }, // No-Show
    { id: 'C103', pacienteId: 'P003', prestadorId: 'M001', fechaHora: new Date('2026-07-12T09:00:00'), duracionMinutos: 30, locacion: 'Miami Health Center', estado: 'reservada' }
];
const listaEspera = [
    { id: 'S01', pacienteId: 'P003', prestadorId: 'M001', especialidad: 'Cardiología', fechaSolicitud: new Date('2026-06-20T11:00:00'), locacion: 'Miami Health Center' },
    { id: 'S02', pacienteId: 'P001', prestadorId: 'M001', especialidad: 'Cardiología', fechaSolicitud: new Date('2026-06-20T09:30:00'), locacion: 'Miami Health Center' } // Llegó antes
];
// ==========================================
// 2. PRUEBA DE LAS FUNCIONES (EJECUCIÓN)
// ==========================================
console.log('--- INICIANDO PRUEBAS DEL SISTEMA HEALTHCORE ---\n');
// --- Prueba de Validaciones ---
console.log('1. VALIDACIONES:');
const nuevaCitaInvalida = { id: 'C104', pacienteId: 'P001' }; // Le faltan datos
console.log(`¿Es válida la cita incompleta?: ${esReservaValida(nuevaCitaInvalida)}`);
console.log(`¿Es válida la cita C101?: ${esReservaValida(listaCitas[0])}\n`);
// --- Prueba de Colecciones (Filtrado y Ordenamiento) ---
console.log('2. COLECCIONES (FILTRADO Y ORDENAMIENTO):');
const citasEnMiami = filtrarCitasPorMultiplesCriterios(listaCitas, undefined, 'Miami Health Center');
console.log(`Citas encontradas en Miami Health Center: ${citasEnMiami.length}`);
const listaEsperaOrdenada = ordenarListaEspera(listaEspera, 'asc');
console.log(`Primer paciente en la lista de espera (por antigüedad): ID Solicitud: ${listaEsperaOrdenada[0].id}\n`);
// --- Prueba de Búsquedas (Lineal y Binaria) ---
console.log('3. BÚSQUEDAS:');
const citaBuscadaLineal = buscarCitaPorDocumentoLineal(listaCitas, 'P002');
console.log(`Búsqueda Lineal -> Cita encontrada para Paciente P002: ${citaBuscadaLineal?.id}`);
// Búsqueda binaria devuelve el índice exacto o -1
const indiceCitaBinaria = busquedaBinariaCitaIndice(listaCitas, 'C102');
console.log(`Búsqueda Binaria -> Índice de la cita 'C102': ${indiceCitaBinaria}`);
const indiceNoEncontrado = busquedaBinariaCitaIndice(listaCitas, 'C999');
console.log(`Búsqueda Binaria -> Índice de cita inexistente: ${indiceNoEncontrado}\n`);
// --- Prueba de Transformaciones y Reportes (Agregaciones) ---
console.log('4. TRANSFORMACIONES Y REPORTES:');
const promedioDuracion = calcularPromedioDuracionCitas(listaCitas);
console.log(`Duración promedio de las consultas: ${promedioDuracion} minutos.`);
const tasaNoShow = calcularTasaNoShow(listaCitas);
console.log(`Tasa actual de inasistencias (No-Show): ${tasaNoShow}%`);
// Simulación de una cancelación tardía (Menos de 8 horas de anticipación)
const fechaCita = listaCitas[2].fechaHora; // 2026-07-12 a las 09:00
const fechaCancelacionTardia = new Date('2026-07-12T05:00:00'); // Solo 4 horas antes
const facturaGenerada = generarFacturaCancelacion(listaCitas[2], medicos[0], fechaCancelacionTardia);
if (facturaGenerada) {
    console.log(`\n[ALERTA FACTURACIÓN] Cancelación tardía detectada.`);
    console.log(`Se generó la factura ${facturaGenerada.id} por un monto de $${facturaGenerada.monto} (${facturaGenerada.motivo}).`);
}
console.log('\n--- PRUEBAS FINALIZADAS CON ÉXITO ---');
