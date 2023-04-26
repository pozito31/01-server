"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerUsuarios = exports.configurarUsuario = exports.mensaje = exports.desconectar = exports.conectarCliente = exports.mapaSockets = exports.mapa = exports.usuariosConectados = void 0;
const usuarios_lista_1 = require("../classes/usuarios-lista");
const usuario_1 = require("../classes/usuario");
const mapa_1 = require("../classes/mapa");
exports.usuariosConectados = new usuarios_lista_1.UsuariosLista();
exports.mapa = new mapa_1.Mapa();
//Eventos de mapa
const mapaSockets = (cliente, io) => {
    cliente.on("marcador-nuevo", (marcador) => {
        exports.mapa.agregarMarcador(marcador);
        cliente.broadcast.emit("marcador-nuevo", marcador);
    });
    cliente.on("marcador-borrar", (id) => {
        exports.mapa.borrarMarcador(id);
        cliente.broadcast.emit("marcador-borrar", id);
    });
    cliente.on("marcador-mover", (marcador) => {
        exports.mapa.moverMarcador(marcador);
        cliente.broadcast.emit("marcador-mover", marcador);
    });
};
exports.mapaSockets = mapaSockets;
const conectarCliente = (cliente, io) => {
    const usuario = new usuario_1.Usuario(cliente.id);
    exports.usuariosConectados.agregar(usuario);
};
exports.conectarCliente = conectarCliente;
const desconectar = (cliente, io) => {
    cliente.on("disconnect", () => {
        console.log("Cliente desconectado");
        exports.usuariosConectados.borrarUsuario(cliente.id);
        io.emit("usuarios-activos", exports.usuariosConectados.getLista());
    });
};
exports.desconectar = desconectar;
// Escuchar mensajes
const mensaje = (cliente, io) => {
    cliente.on("mensaje", (payload) => {
        console.log("Mensaje recibido", payload);
        io.emit("mensaje-nuevo", payload);
    });
};
exports.mensaje = mensaje;
// Configurar usuario
const configurarUsuario = (cliente, io) => {
    cliente.on("configurar-usuario", (payload, callback) => {
        console.log("Configurando Usuario", payload.nombre);
        exports.usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        io.emit("usuarios-activos", exports.usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado`,
        });
        // io.emit("mensaje-nuevo", payload);
    });
};
exports.configurarUsuario = configurarUsuario;
//ObtenerUsuarios
const obtenerUsuarios = (cliente, io) => {
    cliente.on("obtener-usuarios", () => {
        io.to(cliente.id).emit("usuarios-activos", exports.usuariosConectados.getLista());
        // io.emit("mensaje-nuevo", payload);
    });
};
exports.obtenerUsuarios = obtenerUsuarios;
