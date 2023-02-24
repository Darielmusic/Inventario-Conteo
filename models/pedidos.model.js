let emptyPedidos = {
    pedidoInternoId: null,
    // pedidoNo: null,
    sucursalFuenteId: null,
    fuente: null,
    sucursalDestinoId: null,
    destino: null,
    usuarioId: null,
    usuario: null,
    almacenId: null,
    estatusId: null,
    estatus: null,
    fecha: null,
    nota: null,
    total: null,
    // pedidoInternoDetalle: []

};

let modelPostPedidos = {
    "sucursalFuenteId": 0,
    "sucursalDestinoId": 0,
    "usuarioId": 0,
    // "pedidoNo": 0,
    "fecha": Date,
    "nota": "String",
    "total": 0.00
}

let pedidoInternoDetalle = {
    pedidoInternoDetalleId: 0,
    pedidoInternoId: 0,
    articuloId: 0,
    codigoBarra: "string",
    descripcion: "string",
    existenciaLocal: 0,
    existenciaRemota: 0,
    cantidad: 0,
    despachada: 0,
    costoUnitario: 0,
    subTotal: 0,

};

let pedidoDespachoCabecera = {
    despachoInternoId: 0,
    pedidoInternoId: 0,
    // pedidoNo: 0,
    sucursalFuenteId: 0,
    fuente: "string",
    sucursalDestinoId: 0,
    destino: "string",
    // usuarioId: 0,
    // usuario: "string",
    // almacenId: 0,
    estatusId: 0,
    estatus: "string",
    fecha: Date,
    nota: "string",
    total: 0.00,
    // pedidoInternoDetalle: []
};

let despachoInternoDetalle = {
    despachoInternoDetalleId: 0,
    despachoInternoId: 0,
    // pedidoInternoId: 0,
    articuloId: 0,
    codigoBarra: "string",
    descripcion: "string",
    existenciaLocal: 0,
    existenciaRemota: 0,
    cantidad: 0,
    despachada: 0,
    costoUnitario: 0,
    subTotal: 0,

};

let pedidoCabecera = {
    pedidoInternoId: 0,
    // pedidoNo: 0,
    sucursalFuenteId: 0,
    fuente: "string",
    sucursalDestinoId: 0,
    destino: "string",
    usuarioId: 0,
    usuario: "string",
    // almacenId: 0,
    estatusId: 0,
    estatus: "string",
    fecha: Date,
    nota: "string",
    total: 0.00,
    // pedidoInternoDetalle: []
};

let pedidoGeneral = {
    pedidoInternoId: 0,
    // pedidoNo: 0,
    sucursalFuenteId: 0,
    fuente: "string",
    sucursalDestinoId: 0,
    destino: "string",
    usuarioId: 0,
    usuario: "string",
    almacenId: 0,
    estatusId: 0,
    estatus: "string",
    fecha: Date,
    nota: "string",
    total: 0.00,
};

let emptyLogPedido = {
    cambioId: null,
    pedidoInternoId: null,
    accionId: null,
    accion: null,
    usuarioId: null,
    usuario: null,
    fecha: null,
    descripcion: null,
};

let logPedido = {
    cambioId: 0,
    pedidoInternoId: 0,
    accionId: 0,
    accion: "string",
    usuarioId: 0,
    usuario: "string",
    fecha: Date,
    descripcion: "string",
};

let logDespacho = {
    cambioId: 0,
    despachoInternoId: 0,
    accionId: 0,
    accion: "string",
    usuarioId: 0,
    usuario: "string",
    fecha: Date,
    descripcion: "string",
};

let respuestaInsertaDetalles = {
    articuloId: 0,
    cantidadSolicitada: 0.00,
    cantidadInsertada: 0.00,
};

let recibidoCabecera = {
    recibidoInternoId: 0
    , sucursalFuenteId: 0
    , fuente: "string"
    , pedidoInternoId: 0
    , sucursalDestinoId: 0
    , destino: "string"
    , almacenId: 0
    // ,usuarioId: 0
    ,usuario: "string"
    ,estatusId: 0
    ,estatus:"string"
    // ,pedidoNo: 0
    ,fecha: Date
    ,nota: "string"
    ,total: 0.00
};

let recibidoInternoDetalle = {
    RecibidoInternoDetalleId: 0
    // ,pedidoInternoId: 0
    // ,articuloId: 0
    , codigoBarra: "string"
    , descripcion: "string"
    , existenciaLocal: 0
    // ,existenciaRemota: 0
    , despachada: 0
    , recibida: 0
    // ,costoUnitario: 0.00
    ,subTotal: 0.00
};

let vwRecibidoInternoDetalle = {
    RecibidoInternoDetalleId: 0
    ,recibidoInternoId: 0
    ,pedidoInternoId: 0
    , codigoBarra: "string"
    , descripcion: "string"
    , solicitada: 0
    , despachada: 0
    , recibida: 0
    // ,costoUnitario: 0.00
    // ,subTotal: 0.00
};

module.exports = {
    emptyPedidos,
    pedidoCabecera,
    pedidoGeneral,
    logPedido,
    emptyLogPedido,
    pedidoInternoDetalle,
    pedidoDespachoCabecera,
    despachoInternoDetalle,
    respuestaInsertaDetalles,
    recibidoCabecera,
    recibidoInternoDetalle,
    vwRecibidoInternoDetalle,
    logDespacho
}