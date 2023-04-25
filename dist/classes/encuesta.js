"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncuestaData = void 0;
class EncuestaData {
    constructor() {
        this.labels = [];
        this.valores = [0, 0, 0, 0];
    }
    setLabels(labels) {
        this.labels = labels;
    }
    getDataEncuesta() {
        return [{ data: this.valores, label: "Preguntas" }];
    }
    incrementarValor(opcion, valor) {
        this.valores[opcion] += valor;
        return this.getDataEncuesta();
    }
}
exports.EncuestaData = EncuestaData;
