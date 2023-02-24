const { conWeb } = require("../database/connection");
const models = require("../models/articulos.model");
const { modelValidation } = require("../services/modelStrictValidation");

module.exports = {
    getArticulosModel: async function (_, res) {
        res.json(models.articuloModel);
    },
//a
    getArticulos: async function (req, res) {
        const { SucursalDestinoId = 1 } = req.params
        let pool = await conWeb;

        let resultado = await pool
            .request()
            .input("SucursalDestino", SucursalDestinoId)
            .execute("pedidoWeb.Usp_ProductoDatos");

        let dto = modelValidation(models.emptyArticulo, resultado.recordset);
        // pool.close();
        res.json(dto);
    },

    getArticulosById: async function (req, res) {
        const { SucursalDestinoId = 1, articuloId = 0} = req.params
        let pool = await conWeb;

        let resultado = await pool
            .request()
            .input("SucursalDestino", SucursalDestinoId)
            .input("articuloId", articuloId)
            .execute("pedidoWeb.Usp_ProductoDatos");

        let dto = modelValidation(models.emptyArticulo, resultado.recordset);

        if (articuloId < 1)
            // console.error('Debe ingresar un codigo valido');
            res.status(400).json({});

        else
            res.json(dto);
    },

    getFiltroArticulos: async function (req, res) {
        const { SucursalDestinoId = 1, descripcion } = req.params
        let pool = await conWeb;

        let resultado = await pool
            .request()
            .input("SucursalDestino", SucursalDestinoId)
            .input("descripcion", descripcion)
            .execute("pedidoWeb.Usp_FiltroProductoDatos");

        let dto = modelValidation(models.emptyArticulo, resultado.recordset);
        res.json(dto);
    }
}