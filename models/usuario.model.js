let usuario = {
    usuarioId: 0,
    usuario: "string",
    sucursalId: 1,
    estatusUsuarioId: 2,
    tipoUsuarioId: 3,
    cedula: "string",
    nombre: "string",
    apellido: "string",
    direccion: "string",
    correo: "string",
    clave: "string",
    imagen: "string"
};

let tipoUsuario = {
    tipoUsuarioId: null,
    descripcion: null
}

let estatusUsuario = {
    estatusUsuarioId: null,
    descripcion: null
}

let emptyUsuario = {
    usuarioId: null,
    usuario: null,
    estatusId: null,
    estatus: null,
    sucursalId: null,
    sucursal: null,
    tipoUsuarioId: null,
    tipoUsuario: null,
    cedula: null,
    nombre: null,
    apellido: null,
    direccion: null,
    correo: null,
    // clave: null,
    fechaCreacion: null,
    imagen: null,
};
let modelResponse = {
    usuarioId: null,
    mensaje: null,
};

let modelResponseValida = {
    usuarioId: null,
    tipoUsuarioId: null,
    redirect: null,

};

module.exports = {
    usuario,
    emptyUsuario,
    tipoUsuario,
    estatusUsuario,
    modelResponse,
    modelResponseValida
};