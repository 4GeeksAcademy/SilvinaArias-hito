// Búsqueda Lineal
export function buscarCitaPorDocumentoLineal(citas, pacienteId) {
    return citas.find(cita => cita.pacienteId === pacienteId);
}
// Búsqueda Binaria: DEVUELVE EL ÍNDICE O -1 
export function busquedaBinariaCitaIndice(citas, idBuscado) {
    if (citas.length === 0)
        return -1; // Caso límite
    let inicio = 0;
    let fin = citas.length - 1;
    while (inicio <= fin) {
        let medio = Math.floor((inicio + fin) / 2);
        if (citas[medio].id === idBuscado) {
            return medio; // Retorna el indice
        }
        if (citas[medio].id < idBuscado) {
            inicio = medio + 1;
        }
        else {
            fin = medio - 1;
        }
    }
    return -1; // No encontrado
}
