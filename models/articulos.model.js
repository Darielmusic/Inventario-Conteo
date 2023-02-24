let emptyArticulo = {
    Codigo: null,
    CodigoBarra: null,
    Descripcion: null,
    SuplidorCodigo: null,
    Suplidor: null,
    Familia: null,
    Departamento: null,
    Costo: null,
    Existencia: null,
    ExistenciaRemota: null,
};

let articuloModel = {
    Codigo: 0,
    CodigoBarra: "string",
    Descripcion: "string",
    SuplidorCodigo: 0,
    Suplidor: "string",
    Familia: "string",
    Departamento: "string",
    Costo: 0.00,
    Existencia: 0,
    ExistenciaRemota: 0,
};

module.exports = {
    emptyArticulo,
    articuloModel,
};