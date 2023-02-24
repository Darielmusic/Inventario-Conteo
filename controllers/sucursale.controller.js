const { conWeb } = require("../database/connection");
const models = require("../models/sucursales.model");
const { modelValidation } = require("../services/modelStrictValidation");

module.exports = {
    getSucursalesModel: async function(_, res){
        res.json(models.sucursales);
    },

    getSucursales: async function(req, res){
        let pool = await conWeb;

        let resultado = await pool
        .request()
        .query(
            `select * from PedidoWeb.Sucursal`
        );

        let dto = modelValidation(models.emptySucursales, resultado.recordset);

        res.json(dto);
    },
}